/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof(bobj.crv.Viewer) == 'undefined') {
    bobj.crv.Viewer = {};
}

bobj.crv.Viewer.LayoutTypes = {
    FIXED: 'fixed',
    CLIENT: 'client',
    FITREPORT: 'fitreport'
};

bobj.crv.Viewer.PromptingTypes = {
    HTML: 'html',
    FLEX: 'flex'
};
/**
 * Viewer Constructor
 *
 * kwArgs.promptingType [String]  Tells the viewer how to prompt in the advanced case for i params.
 *                             can be "html" if using the prompting engine or "flex" if using the JRC.
 * kwArgs.layoutType [String]  Tells the viewer how to size itself. Can be 
 *                             "client" (fill window), "fitReport", or "fixed"
 * kwArgs.width      [Int]          Width in pixels when layoutType=fixed
 * kwArgs.height     [Int]          Height in pixels when layoutType=fixed
 */
bobj.crv.newViewer = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        promptingType  : bobj.crv.Viewer.LayoutTypes.HTML, 
        layoutType  : bobj.crv.Viewer.LayoutTypes.FIXED, 
        visualStyle : {
            className       : null,
            backgroundColor : null,
            borderWidth     : null,
            borderStyle     : null,
            borderColor     : null,
            fontFamily      : null,
            fontWeight      : null,
            textDecoration  : null,
            color           : null,
            width           : '800px',
            height          : '600px',
            fontStyle       : null,
            fontSize        : null,
            top             : "0px", /* passed by Java DHTML viewer */
            left            : "0px"  /* passed by Java DHTML viewer */
       }        
    }, kwArgs);
    var o = newWidget(kwArgs.id);

    bobj.fillIn(o, kwArgs);  
    o.widgetType = 'Viewer';
    
    o._topToolbar = null;
    o._botToolbar = null;
    o._reportAlbum = null;
    o._separator = null;
    o._print = null;
    o._export = null;
    o._promptDlg = null;
    o._reportProcessing = null;
    o._eventListeners = [];
    
    // Attach member functions 
    o.initOld = o.init;
    o.boundaryControl = new bobj.crv.BoundaryControl(kwArgs.id + "_bc");
    MochiKit.Base.update(o, bobj.crv.Viewer);
    
    return o;    
};

bobj.crv.Viewer.addChild = function(widget) { 
    if (widget.widgetType == 'ReportAlbum') {
        this._reportAlbum = widget; 
    }
    else if (widget.widgetType == 'Toolbar') {
        if (widget.layoutAlign == 'bottom') {
            this._botToolbar = widget;    
        }
        else {
            this._topToolbar = widget;
            this._separator = bobj.crv.newSeparator();
        }
    }
    else if (widget.widgetType == 'PrintUI') {
    	this._print = widget;
    }
    else if (widget.widgetType == 'ExportUI') {
    	this._export = widget;
    }
    else if (widget.widgetType == 'ReportProcessingUI') {
    	this._reportProcessing = widget;
    }
};

/**
 * This function will remove flash activation boxes displayed by IE 
 * by replacing each flash object by its clone.
 */
bobj.crv.Viewer.removeFlashActivations = function() {
    if(_ie && this.layer && this.layer.getElementsByTagName) {
        var flashObjects = this.layer.getElementsByTagName("object");
        for(var i = 0 ; i < flashObjects.length; i++) {
             var flashObject = flashObjects[i];
             var flashObjectClone = flashObject.cloneNode(true);
             var flashObjectParent = flashObject.parentNode;
             var flashObjectSibling = flashObject.nextSibling;
             
             if(flashObjectParent && flashObjectClone) {
                flashObjectParent.removeChild(flashObject);
                flashObjectParent.insertBefore(flashObjectClone, flashObjectSibling);
                flashObjectClone.outerHTML = flashObjectClone.outerHTML;
             }
        }
    }    
};

bobj.crv.Viewer.getHTML = function() {
    var h = bobj.html;
    
    var layerStyle = {
        overflow: 'hidden',
        position: 'relative',
        left : this.visualStyle.left,
        top  : this.visualStyle.top
    };
    
    var html = h.DIV({dir: 'ltr', id:this.id, style:layerStyle,  'class':'dialogzone'},
        this._topToolbar ? this._topToolbar.getHTML() : '',
        this._separator ? this._separator.getHTML() : '',
        this._reportAlbum ? this._reportAlbum.getHTML() : '',
        this._botToolbar ? this._botToolbar.getHTML() : '');

    return html + bobj.crv.getInitHTML(this.widx);
};

bobj.crv.Viewer._onWindowResize = function() {
    if(this._currWinSize.w != winWidth() || this._currWinSize.h != winHeight()) {
        this._doLayout();
        this._currWinSize.w = winWidth();
        this._currWinSize.h = winHeight();
    }
};

bobj.crv.Viewer.init = function() {
    this.initOld();
    bobj.setVisualStyle(this.layer, this.visualStyle);
      
    this._currWinSize = {w: winWidth(), h: winHeight()};
    var connect = MochiKit.Signal.connect;
    var signal = MochiKit.Signal.signal;
    var partial = MochiKit.Base.partial;
    
    if (this.layoutType.toLowerCase() == bobj.crv.Viewer.LayoutTypes.CLIENT) {
        connect(window, 'onresize', this, '_onWindowResize');     
    }
	
    if(this.layer && _ie && bobj.checkParent(this.layer,"TABLE")) {
        connect(window, 'onload', this, '_doLayoutOnLoad'); //delays the call to doLayout to ensure all dom elemment's width and height are set beforehand.
        this._oldCssVisibility = this.css.visibility;
        this.css.visibility = "hidden";
    }
    else {
        this._doLayout();
    }
            
    if (this._topToolbar) { // TODO do for each toolbar
        connect(this._topToolbar, 'showGroupTree', this, '_onShowGroupTreeClick');
        connect(this._topToolbar, 'showParamPanel', this, '_onShowParamPanelClick');
        connect(this._topToolbar, 'zoom', partial(signal, this, 'zoom'));
        connect(this._topToolbar, 'drillUp', partial(signal, this, 'drillUp'));
        
        // Page Navigation events
        connect(this._topToolbar, 'firstPage', partial(signal, this, 'firstPage'));
        connect(this._topToolbar, 'prevPage', partial(signal, this, 'prevPage'));
        connect(this._topToolbar, 'nextPage', partial(signal, this, 'nextPage'));
        connect(this._topToolbar, 'lastPage', partial(signal, this, 'lastPage'));
        connect(this._topToolbar, 'selectPage', partial(signal, this, 'selectPage'));
        connect(this._topToolbar, 'refresh', partial(signal, this, 'refresh'));
        connect(this._topToolbar, 'search', partial(signal, this, 'search'));
        connect(this._topToolbar, 'export', partial(signal, this, 'export'));
        connect(this._topToolbar, 'print', partial(signal, this, 'print'));
    }

    if (this._reportAlbum) {
        connect(this._reportAlbum, 'resizeToolPanel', partial(signal, this, 'resizeToolPanel'));
        connect(this._reportAlbum, 'selectView', this, '_onSelectView'); 
        connect(this._reportAlbum, 'removeView', this, '_onRemoveView');
        connect(this._reportAlbum, 'grpDrilldown', partial(signal, this, 'grpDrilldown'));
        connect(this._reportAlbum, 'grpNodeRetrieveChildren', partial(signal, this, 'grpNodeRetrieveChildren'));
        connect(this._reportAlbum, 'grpNodeCollapse', partial(signal, this, 'grpNodeCollapse'));
        connect(this._reportAlbum, 'grpNodeExpand', partial(signal, this, 'grpNodeExpand'));
        
        if (this._topToolbar) {    
            var panelType = this._reportAlbum._curView.toolPanel.initialViewType;
            this._topToolbar.updateToolPanelButtons(panelType);
        }
    }
    
    if (this._print) {
    	connect(this._print, 'printSubmitted', partial(signal, this, 'printSubmitted'));
    }
    
    if (this._export) {
    	connect(this._export, 'exportSubmitted', partial(signal, this, 'exportSubmitted'));
    }
        
    this._updateRefreshButton();    
    this._loadReportPageContent();	
    this.scrollToHighlighted();
	
    connect(window, 'onload', this, 'removeFlashActivations');
    signal(this, 'initialized');
};


bobj.crv.Viewer._updateRefreshButton = function() {
    if(this._reportAlbum) {
        var currentView = this._reportAlbum.getSelectedView();
        if(currentView) {
            if(!currentView.isMainReport()) {
                this.disableRefreshButton(true);
            }
        }  
    }
};

bobj.crv.Viewer._loadReportPageContent = function() {
    var reportPage = this.getReportPage();
    if(reportPage) {
        reportPage.loadContent();
    }
};

bobj.crv.Viewer._doLayoutOnLoad = function() {
	this.css.visibility = this._oldCssVisibility;
	this._doLayout();
};

bobj.crv.Viewer._doLayout = function() {
    var topToolbarH = this._topToolbar ? this._topToolbar.getHeight() : 0;
    var topToolbarW = this._topToolbar ? this._topToolbar.getWidth() : 0;
    var botToolbarH = this._botToolbar ? this._botToolbar.getHeight() : 0;
    var separatorH = this._separator ? this._separator.getHeight() : 0; 
    
    var layout = this.layoutType.toLowerCase();
    
    if (bobj.crv.Viewer.LayoutTypes.CLIENT == layout) {
        this.css.width = '100%';
        this.css.height = '100%';
    }
    else if (bobj.crv.Viewer.LayoutTypes.FITREPORT == layout) {
        var albumSize = this._reportAlbum.getBestFitSize();
        var viewerWidth = (albumSize.width < topToolbarW) ? topToolbarW : albumSize.width;
        var viewerHeight = (albumSize.height + topToolbarH + botToolbarH + separatorH); 
        
        this.css.height = viewerHeight + 'px';
        this.css.width  = viewerWidth + 'px'; 

    }
    else { // fixed layout 
        this.css.width = this.visualStyle.width;
        this.css.height = this.visualStyle.height;
    }
    
    var innerW = this.getWidth();
    var innerH = this.getHeight();
    
    var albumH = Math.max(0, innerH - topToolbarH - botToolbarH - separatorH);
    
    if (this._reportAlbum) {
        this._reportAlbum.resizeOuter(innerW, albumH);
    }
    
    if (this._botToolbar) {
        this._botToolbar.move(0, topToolbarH + separatorH + albumH);
    }

    if (this._print && this._print.layer) {
    	this._print.center();
    }
    
    if (this._export && this._export.layer) {
    	this._export.center();
    }

    if (this._reportProcessing && this._reportProcessing.layer) {
    	this._reportProcessing.center();
    }
    
    
    var viewerP = MochiKit.Style.getElementPosition(this.layer);
    var viewerD = MochiKit.Style.getElementDimensions(this.layer);
    
    if (this._modalBackground)
    {
    	var MODAL_STYLE = this._modalBackground.style;
        MODAL_STYLE.top = viewerP.y + "px";
        MODAL_STYLE.left = viewerP.x + "px";
        MODAL_STYLE.width = viewerD.w + "px";
        MODAL_STYLE.height = viewerD.h + "px";
    }
    
    var bodyD = bobj.getBodyScrollDimension();

    var isViewerCutOff = ((viewerP.x + viewerD.w) >= bodyD.w) || ((viewerP.y + viewerD.h) >= bodyD.h);

    if(isViewerCutOff && (layout !=  bobj.crv.Viewer.LayoutTypes.CLIENT)) {

        /* BoundaryControl adds a hidden div with the same dimension and position as current viewer to body
           to fix the problem of IE regarding scrollbar that are hidden when left + viewer's width > body's width
        */

        this.boundaryControl.updateBoundary(viewerD.w, viewerD.h, viewerP.x, viewerP.y);
    }
    else {
    	this.boundaryControl.updateBoundary(0, 0, 0, 0);
    }
    
    this._adjustWindowScrollBars();
};

bobj.crv.Viewer._onShowGroupTreeClick = function(isChecked) { 
    // translate checked==false to panelType==none
    var panelType = isChecked ? bobj.crv.ToolPanelType.GroupTree : bobj.crv.ToolPanelType.None;
    this.selectToolPanel(panelType);
};

bobj.crv.Viewer._onShowParamPanelClick = function(isChecked) { 
    // translate checked==false to panelType==none
    var panelType = isChecked ? bobj.crv.ToolPanelType.ParameterPanel : bobj.crv.ToolPanelType.None;
    this.selectToolPanel(panelType);
};

bobj.crv.Viewer.selectToolPanel = function(panelType) {
    var Type = bobj.crv.ToolPanelType;
    if (this._reportAlbum) {    
        this._reportAlbum._curView.toolPanel.setView (panelType);
        this._reportAlbum._curView.setDisplayToolPanel(Type.None !== panelType);
    }
    if (Type.GroupTree == panelType) {
        MochiKit.Signal.signal(this, 'showGroupTree');
    }
    else if (Type.ParameterPanel == panelType) {
        MochiKit.Signal.signal(this, 'showParamPanel');
    }
    else if (Type.None == panelType) {
        MochiKit.Signal.signal(this, 'hideToolPanel');
    }
};

bobj.crv.Viewer._onSelectView = function(view) {
    MochiKit.Signal.signal(this, 'selectView', view);
};

bobj.crv.Viewer._onRemoveView = function(view) {
    MochiKit.Signal.signal(this, 'removeView', view);
};

bobj.crv.Viewer.resize = function(w, h) {
    if (bobj.isNumber(w)) {
        w = w + 'px';   
    }

    if (bobj.isNumber(h)) {
        h = h + 'px'; 
    }
    
    this.visualStyle.width = w; 
    this.visualStyle.height = h; 
    this._doLayout();
};

bobj.crv.Viewer.disableRefreshButton = function(isDisabled) {
    if (this._topToolbar) {
        var refreshButton = this._topToolbar.refreshButton;
        if(refreshButton) {
            refreshButton.setDisabled(isDisabled);
        }
    }
    if (this._botToolbar) {
        var refreshButton = this._botToolbar.refreshButton;
        if(refreshButton) {
            refreshButton.setDisabled(isDisabled);
        }
    }
};

/** 
 * Set the page number. Updates toolbars with current page and number of pages
 * info.
 *
 * @param curPageNum [String]  
 * @param numPages   [String] (eg. "1" or "1+");
 */
bobj.crv.Viewer.setPageNumber = function(curPageNum, numPages) {
    if (this._topToolbar) {
        this._topToolbar.setPageNumber(curPageNum, numPages);
    }
    if (this._botToolbar) {
        this._botToolbar.setPageNumber(curPageNum, numPages);
    }
};

/**
 * Display the prompt dialog.
 *
 * @param html [string] HTML fragment to display inside the dialog's form.
 */
bobj.crv.Viewer.showPromptDialog = function(html) {
    html = html || '';
    
    if (!this._promptDlg) {
        var promptDialog_ShowCB = MochiKit.Base.bind(this._onShowPromptDialog, this);
        var promptDialog_HideCB = MochiKit.Base.bind(this._onHidePromptDialog, this);
        this._promptDlg = bobj.crv.params.newParameterDialog({id: this.id + '_promptDlg', showCB : promptDialog_ShowCB, hideCB : promptDialog_HideCB});    
    }
    
    if(this._promptDlg.isVisible()) {
        this.hidePromptDialog(); // Must close the current dialog before changing the html
    }
    
    //The reason for saving document.onkeypress is that prompt dialog steals the document.onkeypress and never sets it back
    this._originalDocumentOnKeyPress = document.onkeypress; // Must be set before .setPromptHTML(html) as this function call modifies document.onkeypress;
    this._promptDlg.setPromptHTML(html);
    setTimeout(MochiKit.Base.bind(this._promptDlg.show,this._promptDlg,true),1);
    
};

bobj.crv.Viewer.getPromptingType = function() {
	return this.promptingType;
};

bobj.crv.Viewer.showFlexPromptDialog = function(paramCtrl, param, servletURL) {
    var FLEXUI = bobj.crv.params.FlexParameterUI;
    
    if (!FLEXUI.checkFlashPlayer()){
    	var msg = L_bobj_crv_FlashRequired;
    	this.showError(msg.substr(0, msg.indexOf('{0}')), FLEXUI.getInstallHTML());
    	return;
    }
    
    FLEXUI.setCurrentIParamInfo(this.id, paramCtrl, param);
    FLEXUI.setViewerLayoutType(this.id, this.layoutType);
    FLEXUI.setCloseDialogCallBack(this.id, MochiKit.Base.bind(this.hideFlexPromptDialog, this));
	
    if (!this._promptDlg) {
        this._modalBackground = document.createElement('div');
        this._modalBackground.id = bobj.uniqueId();

        var vPos = MochiKit.Style.getElementPosition(this.layer);
        var vDim = MochiKit.Style.getElementDimensions(this.layer);
        
        var MODAL_STYLE = this._modalBackground.style;
        MODAL_STYLE.top = vPos.y;
        MODAL_STYLE.left = vPos.x;
        MODAL_STYLE.width = vDim.w;
        MODAL_STYLE.height = vDim.h;
        MODAL_STYLE.backgroundColor = '#888888';
        MODAL_STYLE.position = 'absolute'; 
        MODAL_STYLE.opacity = 0.30;
        MODAL_STYLE.filter = 'alpha(opacity=30)';
        MODAL_STYLE.zIndex = bobj.constants.modalLayerIndex - 2;

        document.body.appendChild(this._modalBackground);
        
        this._promptDlg = document.createElement('div');
        this._promptDlg.id = this.id + '_promptDlg';
	
        var PROMPT_STYLE = this._promptDlg.style;
        PROMPT_STYLE.border = '1px'; 
        PROMPT_STYLE.borderStyle = 'solid'; 
        PROMPT_STYLE.borderColor = '#000000'; 
        PROMPT_STYLE.position = 'absolute'; 
        PROMPT_STYLE.zIndex = bobj.constants.modalLayerIndex;
        
        var divID = bobj.uniqueId();
        this._promptDlg.innerHTML = "<div id=\"" + divID + "\" name=\"" + divID + "\"></div>";
        
        document.body.appendChild(this._promptDlg);
        
        FLEXUI.createSWF(this.id, divID, servletURL, true);
    }
    else
    {
        this._promptDlg.style.display = '';
    	FLEXUI.init(this.id);
    }

    this._modalBackground.style.visibility = 'visible';
};

bobj.crv.Viewer._onShowPromptDialog = function() {
	this._adjustWindowScrollBars();
};

bobj.crv.Viewer._onHidePromptDialog = function() {
	this._adjustWindowScrollBars();
	document.onkeypress = this._originalDocumentOnKeyPress;
};

/**
 * Hide the prompt dialog
 */ 
bobj.crv.Viewer.hidePromptDialog = function() {
    if (this._promptDlg && this._promptDlg.isVisible()) {
        this._promptDlg.show(false);
    }
};

/**
 * Hide the flex prompt dialog
 */ 
bobj.crv.Viewer.hideFlexPromptDialog = function() {
    if (this._promptDlg) {
    	if (_ie)
    	{
    		// IE has an issue where if a user calls back from a swf
    		// and closes the containing div then when the div is shown
    		// again the swf will lose any external interface calls. To get around
    		// this we must set the focus to something other than the swf first
    		// before hiding the window.
		    this._promptDlg.focus();
    	} 

        this._promptDlg.style.visibility = 'hidden';
        this._promptDlg.style.display = 'none';
        this._modalBackground.style.visibility = 'hidden';
    }
};

bobj.crv.Viewer._adjustWindowScrollBars = function() {
    if(_ie && this.layoutType == bobj.crv.Viewer.LayoutTypes.CLIENT && 
        this._promptDlg && this._promptDlg.layer && MochiKit.DOM.currentDocument().body) {
        
        var bodyOverFlow, pageOverFlow;
        var body = MochiKit.DOM.currentDocument().body;
        var promptDlgLayer = this._promptDlg.layer;
        
        if(this.getReportPage() && this.getReportPage().layer) {
            var reportPageLayer= this.getReportPage().layer;
        }
        
        if(!window["bodyOverFlow"]) {
            window["bodyOverFlow"] = MochiKit.DOM.getStyle(body,'overflow');
        }
        
        if(body.offsetHeight <  (promptDlgLayer.offsetTop + promptDlgLayer.offsetHeight)) {
            if(window["bodyOverFlow"] == "hidden") {
                bodyOverFlow = "scroll";
            }
            pageOverFlow = "hidden";
        }
        else {
            bodyOverFlow = window["bodyOverFlow"];
            pageOverFlow = "auto";
        }    
        
        body.style.overflow = bodyOverFlow;
        if(reportPageLayer) {
            reportPageLayer.style.overflow = pageOverFlow;
        }

    }
};

/**
 * Display an error message dialog.
 *
 * @param text [String]    Short, user-friendly error message
 * @param details [String] Technical info that's hidden unless the user chooses to see it  
 */
bobj.crv.Viewer.showError = function(text, details) {
    var dlg = bobj.crv.ErrorDialog.getInstance();
    dlg.setText(text, details);
    dlg.setTitle(L_bobj_crv_Error);
    dlg.show(true);
};


/**
 * Update the UI using the given properties
 *
 * @param update [Object] Component properties 
 */
bobj.crv.Viewer.update = function(update , updatePack) {
    if (!update) {
        return;    
    }
    
    for(var childNum in update.children) {
        var child = update.children[childNum];
        if(child) {
            switch(child.cons) {
                case "bobj.crv.newReportAlbum":
                    if (this._reportAlbum && updatePack.updateReportAlbum()) {
                        this._reportAlbum.update(child, updatePack);
                    }
                    break;
                case "bobj.crv.newToolbar":
                     if (this._topToolbar && updatePack.updateToolbar()) { 
                         this._topToolbar.update(child, updatePack);
                     }               
                     break;
            }
        }
    
    }
    
    if(updatePack.refreshLayout()) {
        this._doLayout();
    }
    
    if(updatePack.requiresScrolling()) {
        this.scrollToHighlighted();
    }

    
};

bobj.crv.Viewer.getParameterPanel = function() {
    if (this._reportAlbum) {
        var view = this._reportAlbum.getSelectedView();
        if (view && view.toolPanel) { 
            return view.toolPanel.getParameterPanel();
        }
    }
};

bobj.crv.Viewer.getReportPage = function() {
    if (this._reportAlbum) {
        var view = this._reportAlbum.getSelectedView();
        if (view && view.toolPanel) { 
            return view.reportPage;
        }
    }    
};
bobj.crv.Viewer.scrollToHighlighted = function() {
    var currentView = this._reportAlbum.getSelectedView();
    var reportPage = getLayer(currentView.reportPage.id);
    var crystalHighlighted = getLayer("CrystalHighLighted");
    
    if(!crystalHighlighted || !reportPage) { 
        return;
    }   
 
    if(MochiKit.DOM.isParent(crystalHighlighted,reportPage)) {
        var layoutType = this.layoutType.toLowerCase();
        var position;
        if(layoutType == bobj.crv.Viewer.LayoutTypes.FITREPORT) {
            position = MochiKit.Style.getElementPosition(crystalHighlighted);
            window.scrollTo(position.x,position.y);
        }
        else {
            position = MochiKit.Style.getElementPosition(crystalHighlighted,reportPage);
            reportPage.scrollLeft = position.x;
            reportPage.scrollTop = position.y;
        }  
    }
};

bobj.crv.Viewer.addViewerEventListener = function (e, l) {
        var ls = this._eventListeners[e];
        if (!ls) {
            this._eventListeners[e] = [l];
            return;
        }
    
        ls[ls.length] = l;
    };
    
bobj.crv.Viewer.removeViewerEventListener = function (e, l) {
        var ls = this._eventListeners[e];
        if (ls) {
            for (var i = 0, lsLen = ls.length; i < lsLen; i++) {
                if (ls[i] == l){
                    ls.splice(i, 1);
                    return;
                }
            }
        }
    };
    
bobj.crv.Viewer.getEventListeners = function (e) {
        return this._eventListeners[e];
    };

bobj.crv.BoundaryControl = function(id) {    
    this.id = id;  
    return this;
};

bobj.crv.BoundaryControl.prototype = {
    updateBoundary : function(width,height,left,top) {
        if(!this.layer) {
            this._init();
        }
        if(this.layer) {
            this.layer.style.width = width;
            this.layer.style.height = height;
            this.layer.style.left = left;
            this.layer.style.top = top;
        }
    },
    
    _init: function() {
        var style= {
            display:'block',
            visibility:'hidden',
            position:'absolute'
        };    
        if(!this.layer){
            var html = bobj.html.DIV({id : this.id, style : style});
            append2(_curDoc.body,html);
            this.layer = getLayer(this.id);
            
        }
    }
}
