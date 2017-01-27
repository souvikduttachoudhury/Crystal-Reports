/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof(bobj.crv.Toolbar) == 'undefined') {
    bobj.crv.Toolbar = {};
}
if (typeof(bobj.crv.ToolbarButton) == 'undefined') {
    bobj.crv.ToolbarButton = {};
}
if (typeof(bobj.crv.SelectPageControl) == 'undefined') {
    bobj.crv.SelectPageControl = {};
}
if (typeof(bobj.crv.ZoomControl) == 'undefined') {
    bobj.crv.ZoomControl = {};
}
if (typeof(bobj.crv.SearchTextControl) == 'undefined') {
    bobj.crv.SearchTextControl = {};
}

/*
 * @return the Y location indicating the top of a toolbar icon in the combined image
 */
bobj.crv.toolbarImageY = function (index)
{
    // ALL images are 22 pixels height and set 3 pixels into their placeholder
    return index * 22 + 3;
};

// these are the indexes of icons in the toolbar.gif image
bobj.crv.exportIconIndex = 0;
bobj.crv.printIconIndex = 1;
bobj.crv.groupTreeIconIndex = 2;
bobj.crv.paramPanelIconIndex = 3;
bobj.crv.firstIconIndex = 4;
bobj.crv.prevIconIndex = 5;
bobj.crv.nextIconIndex = 6;
bobj.crv.lastIconIndex = 7;
bobj.crv.refreshIconIndex = 8;
bobj.crv.searchIconIndex = 9;

/**
 * Toolbar Constructor
 */
bobj.crv.newToolbar = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
    kwArgs = UPDATE({
        id: bobj.uniqueId(),
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
            width           : null,
            height          : null,
            fontStyle       : null,
            fontSize        : null
       }
        
   }, kwArgs);
   
    var o = newPaletteContainerWidget(kwArgs.id);

    o.margin = 0;
    bobj.fillIn(o, kwArgs);  
    o._rightZoneWgts = [];
    o.widgetType = 'Toolbar';
    
    // Attach member functions (since we can't use prototypes)
    o.initOld = o.init;
    UPDATE(o, bobj.crv.Toolbar);
    
    o.palette = newPaletteWidget(o.id + "_palette");
    o.add(o.palette);
    return o;    
};

/**
 * Adds a widget to the toolbar and attaches callbacks to known types.
 *
 * @param widget [Widget]  The control to be displayed in the toolbar.
 */
bobj.crv.Toolbar.addChild = function(widget) {
    var SIGNAL = MochiKit.Signal.signal;
    var PARTIAL = MochiKit.Base.partial;
    var BIND = MochiKit.Base.bind;
    
    // Connect callbacks that broadcast events as signals 
    switch (widget.widgetType) {
        case 'ExportButton':
            this.exportButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'export');
            break;
        case 'PrintButton':
            this.printButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'print');
            break;
        case 'ParamPanelToggleButton':
            this.paramPanelToggleButton = widget;
            widget.toggleCB = BIND(this._onToggleButtonClick, this, widget);
            break;
        case 'GroupPanelToggleButton':
            this.groupPanelToggleButton = widget;
            widget.toggleCB = BIND(this._onToggleButtonClick, this, widget);
            break;
        case 'FirstPageButton':
            this.firstPageButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'firstPage');
            break;
        case 'PrevPageButton':
            this.prevPageButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'prevPage');
            break;
        case 'NextPageButton':
            this.nextPageButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'nextPage');
            break;
        case 'LastPageButton':
            this.lastPageButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'lastPage');
            break;
        case 'RefreshButton':
            this.refreshButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'refresh');
            break;
        case 'ZoomControl':
            this.zoomControl = widget;
            widget.zoomCB = PARTIAL(SIGNAL, this, 'zoom');
            break;
        case 'SelectPageControl':
            this.selectPageControl = widget;
            widget.selectPageCB = PARTIAL(SIGNAL, this, 'selectPage');
            break;
        case 'SearchTextControl':
            this.searchTextControl = widget;
            widget.searchTextCB = PARTIAL(SIGNAL, this, 'search');
            break;
        case 'DrillUpButton':
            this.drillUpButton = widget;
            widget.clickCB = PARTIAL(SIGNAL, this, 'drillUp');
            break;
        default:    
            break;
    }
    
    // Delay adding right-aligned widgets due to the semantics of the palette
    if (widget.layoutAlign == 'right') {
        this._rightZoneWgts.push(widget);    
    }
    else {
        this.palette.add(widget);
    }
};

bobj.crv.Toolbar.init = function() { 
    this.initOld();
    bobj.setVisualStyle(this.layer,this.visualStyle);
    this.palette.init();
    this._updateNavButtons();
};

bobj.crv.Toolbar.write = function() {
    this._addRightZone();
    this.begin();
    this.palette.write();
    this.end();
    document.write(bobj.crv.getInitHTML(this.widx));
};

/**
 * Overrides parent. Opens the toolbar's tags.
 */
bobj.crv.Toolbar.beginHTML = function()
{
    return bobj.html.openTag('div', {
            id: this.id,
            'class':'dialogzone',
            style:{
                overflow:'hidden', 
                margin:this.margin+'px'}});    
};

bobj.crv.Toolbar.getHTML = function() {
    this._addRightZone();
    return (this.beginHTML() 
        + this.palette.getHTML() 
        + this.endHTML() 
        + bobj.crv.getInitHTML(this.widx) );
};

bobj.crv.Toolbar.getWidth = function() {
    var itemLayer;
    var width =0;
    var items = this.palette.items;
    for(var i = 0, len = items.length; i < len; i++) {
        itemLayer = items[i].layer;
        if(itemLayer.offsetWidth) {
            width += itemLayer.offsetWidth;
        }
        if(itemLayer.offsetLeft) {
            width += (itemLayer.offsetLeft * 2);
        }
    }
    return width;
};
/**
 * Private. Adds right-aligned widgets to the right zone of the palette 
 */
bobj.crv.Toolbar._addRightZone = function() {
    this.palette.beginRightZone();

    var w = null;
    while (w = this._rightZoneWgts.pop()) {
        this.palette.add(w);
    }

    delete this._rightZoneWgts;
};

/** 
 * Private. Updates the enabled state of navigation buttons based on the 
 * current page number and the number of pages.
 */
bobj.crv.Toolbar._updateNavButtons = function() {
    if (this.selectPageControl) {
        var curPg = this.selectPageControl.getCurrentPage();
        if (this.firstPageButton) {
            this.firstPageButton.setDisabled(curPg == 1);    
        }
        if (this.prevPageButton) {
            this.prevPageButton.setDisabled(curPg == 1);  
        }
        
        var numPgsStr = this.selectPageControl.getNumPages();
        var lastPgKnown = numPgsStr.indexOf('+') == -1; 
        var numPgs = parseInt(numPgsStr, 10);
        var fwdDisabled = lastPgKnown && numPgs == curPg;
        
        if (this.nextPageButton) {
            this.nextPageButton.setDisabled(fwdDisabled);    
        }
        if (this.lastPageButton) {
            this.lastPageButton.setDisabled(fwdDisabled);  
        }
    }
};

bobj.crv.Toolbar._onToggleButtonClick = function(button, isChecked) {
    var showOrHide = (isChecked ? L_bobj_crv_Hide :  L_bobj_crv_Show);
	
    if (this.paramPanelToggleButton === button) {
        if (this.groupPanelToggleButton) {
            this.groupPanelToggleButton.check(false);  
            this.groupPanelToggleButton.changeTooltip(L_bobj_crv_Show + " " + L_bobj_crv_GroupTree);  
        }
        
        this.paramPanelToggleButton.changeTooltip(showOrHide + " " + L_bobj_crv_ParamPanel);
        MochiKit.Signal.signal(this, 'showParamPanel', isChecked);    
    }
    else if (this.groupPanelToggleButton === button) {
        if (this.paramPanelToggleButton) {
            this.paramPanelToggleButton.check(false);   
            this.paramPanelToggleButton.changeTooltip(L_bobj_crv_Show + " " + L_bobj_crv_ParamPanel);  
        }

        this.groupPanelToggleButton.changeTooltip(showOrHide + " " + L_bobj_crv_GroupTree);        
        MochiKit.Signal.signal(this, 'showGroupTree', isChecked);
    }
};

bobj.crv.Toolbar.setPageNumber = function(curPage, numPages) {
    if (this.selectPageControl) {
        if (curPage) {
            this.selectPageControl.setCurrentPage(curPage);
        }
        if (numPages) {
            this.selectPageControl.setNumPages(numPages);
        }
        this._updateNavButtons();
    }
};

/**
 * public. Updates the Tool Panel buttons based on the Panel Type given.
 */
bobj.crv.Toolbar.updateToolPanelButtons = function(panelType) {
    var Type = bobj.crv.ToolPanelType;
    var groupPanelButtonChecked = false;
    var paramPanelButtonChecked = false;
    
    if (Type.GroupTree == panelType) {
        groupPanelButtonChecked = true;
    }
    else if (Type.ParameterPanel == panelType) {
        paramPanelButtonChecked = true;
    }
    
    if (this.groupPanelToggleButton) {
        this.groupPanelToggleButton.check(groupPanelButtonChecked);
        var showOrHide = groupPanelButtonChecked ? L_bobj_crv_Hide : L_bobj_crv_Show;
        this.groupPanelToggleButton.changeTooltip(showOrHide + " " + L_bobj_crv_GroupTree);
    }
    
    if (this.paramPanelToggleButton) {
        this.paramPanelToggleButton.check(paramPanelButtonChecked);
        var showOrHide = paramPanelButtonChecked ? L_bobj_crv_Hide : L_bobj_crv_Show;
        this.paramPanelToggleButton.changeTooltip(showOrHide + " " + L_bobj_crv_ParamPanel);        
    }
};

bobj.crv.Toolbar.update = function(update,updatePack) {
    if(update) {
        for(var childNum in update.children) {
            var child = update.children[childNum];
            if(child) {
                switch(child.cons) {
                    case "bobj.crv.newSelectPageControl":
                        if(this.selectPageControl) {
                            this.selectPageControl.update(child, updatePack);
                            this._updateNavButtons();
                        }
                        break;
                    case "bobj.crv.newSearchTextControl": 
                        if(this.searchTextControl) {
                            this.searchTextControl.update(child, updatePack);
                        }
                        break;                
                }         
            }
        }
    }
};

/**
 * Constructor. Base class for toolbar buttons. 
 */
bobj.crv.newToolbarButton = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(), 
        icon: null,
        tooltip: null,
        text: null,
        isDisabled: false,
        isToggleButton: false,
        isChecked: false,
        clickCB: null,
        width: 16,
        height: 16,
        dx: 3,
        dy: 3,
        disDx: 25,
        disDy: 3
    }, kwArgs);    
    
    var cons = kwArgs.isToggleButton ? newIconCheckWidget : newIconWidget;
    
    var o = cons.call(null, 
        kwArgs.id,        
        kwArgs.icon,      
        kwArgs.clickCB,   
        kwArgs.text,      
        kwArgs.tooltip,   
        kwArgs.width,     
        kwArgs.height,    
        kwArgs.dx,        
        kwArgs.dy,        
        kwArgs.disDx,      
        kwArgs.disDy);    
        
    o._tbBtnOldInit = o.init;
    o._tbBtnKwArgs = kwArgs;
    MochiKit.Base.update(o, bobj.crv.ToolbarButton);
    
    return o;    
};

bobj.crv.ToolbarButton.init = function() {
    this._tbBtnOldInit();
    var kwArgs = this._tbBtnKwArgs;
    
    this.setDisabled(kwArgs.isDisabled);
};

/**
 * FirstPageButton constructor
 */
bobj.crv.newFirstPageButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'), 
        tooltip: L_bobj_crv_FirstPage,
        dy: bobj.crv.toolbarImageY (bobj.crv.firstIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.firstIconIndex)
    }, kwArgs));

    o.widgetType = 'FirstPageButton';
    return o;
};

/**
 * PrevPageButton constructor
 */
bobj.crv.newPrevPageButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        tooltip: L_bobj_crv_PrevPage,
        dy: bobj.crv.toolbarImageY (bobj.crv.prevIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.prevIconIndex)
    }, kwArgs));

    o.widgetType = 'PrevPageButton';
    return o;
};

/**
 * NextPageButton constructor
 */
bobj.crv.newNextPageButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        tooltip: L_bobj_crv_NextPage,
        dy: bobj.crv.toolbarImageY (bobj.crv.nextIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.nextIconIndex)
    }, kwArgs));
    
    o.widgetType = 'NextPageButton';
    return o;
};

/**
 * LastPageButton constructor
 */
bobj.crv.newLastPageButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        tooltip: L_bobj_crv_LastPage,
        dy: bobj.crv.toolbarImageY (bobj.crv.lastIconIndex),     
        disDy:  bobj.crv.toolbarImageY (bobj.crv.lastIconIndex)
    }, kwArgs));
    
    o.widgetType = 'LastPageButton';
    return o;
};

/**
 * DrillUp constructor
 */
bobj.crv.newDrillUpButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/up.gif'),
        tooltip: L_bobj_crv_DrillUp
    }, kwArgs));
    
    o.widgetType = 'DrillUpButton';
    return o;
};

/**
 * PanelToggleButton constructor
 */
bobj.crv.newPanelToggleButton = function(kwArgs) {                
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        text: L_bobj_crv_Parameters,
        isToggleButton: true,
        clickCB: function() {
            if (this.toggleCB) { 
                this.toggleCB(this.isChecked());    
            } 
        },
        dy: bobj.crv.toolbarImageY (bobj.crv.paramPanelIconIndex),        
        disDy:  bobj.crv.toolbarImageY (bobj.crv.paramPanelIconIndex)
    }, kwArgs));
    
    o.widgetType = 'ParamPanelToggleButton';
    return o;
};

/**
 * GroupTreeToggleButton constructor
 */
bobj.crv.newGroupTreeToggleButton = function(kwArgs) {                
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        text: L_bobj_crv_GroupTree,
        isToggleButton: true,
        clickCB: function() {
            if (this.toggleCB) { 
                this.toggleCB(this.isChecked());    
            } 
        },
        dy: bobj.crv.toolbarImageY (bobj.crv.groupTreeIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.groupTreeIconIndex)
    }, kwArgs));
    
    o.widgetType = 'GroupPanelToggleButton';
    
    return o;
};

/**
 * RefreshButton constructor
 */
bobj.crv.newRefreshButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        tooltip: L_bobj_crv_Refresh,
        dy: bobj.crv.toolbarImageY (bobj.crv.refreshIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.refreshIconIndex)
    }, kwArgs));
    
    o.widgetType = 'RefreshButton';
    return o;
};

/**
 * ExportButton constructor
 */
bobj.crv.newExportButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        tooltip: L_bobj_crv_Export,
        dy: bobj.crv.toolbarImageY (bobj.crv.exportIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.exportIconIndex)
    }, kwArgs));
    
    o.widgetType = 'ExportButton';
    return o;
};

/**
 * PrintButton constructor
 */
bobj.crv.newPrintButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/toolbar.gif'),
        tooltip: L_bobj_crv_Print,
        dy: bobj.crv.toolbarImageY (bobj.crv.printIconIndex),
        disDy:  bobj.crv.toolbarImageY (bobj.crv.printIconIndex)
    }, kwArgs));
    
    o.widgetType = 'PrintButton';
    return o;
};

/**
 * LogoButton constructor
 */
bobj.crv.newLogoButton = function(kwArgs) {
    var o = bobj.crv.newToolbarButton(MochiKit.Base.update({
        icon: bobj.crvUri('images/logo.gif'),
        tooltip: "SAP Crystal Reports",
        clickCB: function() {window.location.href = 'http://www.businessobjects.com/ipl/default.asp?destination=ViewerLogoLink&product=crystalreports&version=12.0';},
        width: 120,
        height: 20,
        dx: 0,
        dy: 0,
        disDx: 0,
        disDy: 0
    }, kwArgs));
    
    o.layoutAlign = 'right';
    o.widgetType = 'LogoButton';
    return o;
};

/**
 * ToolbarSeparator constructor
 */
bobj.crv.newToolbarSeparator = function() {
    return newPaletteVerticalSepWidget(bobj.uniqueId());
};

/**
 * ZoomControl Constructor
 */
bobj.crv.newZoomControl = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
    kwArgs = UPDATE({
        initialZoom: '100%',
        id: bobj.uniqueId()
    }, kwArgs);
    if (bobj.isNumber(kwArgs.initialZoom)) {
        kwArgs.initialZoom = kwArgs.initialZoom + '%';    
    }
    
    var o = newTextComboWidget(
        kwArgs.id,
        5,               // max chars
        L_bobj_crv_Zoom, // tooltip
        60,              // width 
        bobj.crv.ZoomControl._zoomChangeCB, // change CB
        null,            // check CB
        null,            // beforeShow CB
        null             // form name
        );

    var zoomList = ['400%','300%','200%','150%','125%','100%','75%','50%','25%'];
    
    for (var i = 0, len = zoomList.length; i < len; ++i) {
        var zoomLevel = zoomList[i];
        o.add(zoomLevel, zoomLevel, (zoomLevel == kwArgs.initialZoom));
    }
    o.text.setValue(kwArgs.initialZoom);
    
    o.zoomCB = null;
    o.widgetType = 'ZoomControl';
    
    o.initOld = o.init;
    o._initZoom = kwArgs.initialZoom;
    
    UPDATE(o, bobj.crv.ZoomControl); 
    
    return o;
};

bobj.crv.ZoomControl.init = function() {
    this.initOld();
    this.setZoom(this._initZoom);
};

bobj.crv.ZoomControl.setZoom = function(lvl) {
    var zoomVal = parseInt(lvl, 10);
    if (bobj.isNumber(zoomVal)) {
        zoomVal += '%';
        
        this.valueSelect(zoomVal);
        
        var si = this.selectedItem;
        if (si && si.val != zoomVal) {
            si.check(false);
            this.selectedItem = null;
        }
        
        this._lastValue = zoomVal;
        return true;
    }
    return false;
};

bobj.crv.ZoomControl._zoomChangeCB = function() {
    var zoomLvl = parseInt(this.text.getValue(), 10);
    
    if (bobj.isNumber(zoomLvl)) {
         if(zoomLvl < 10) {
            zoomLvl = 10;
        } else if (zoomLvl > 400) {
            zoomLvl = 400;
        }
    }
    
    if (!this.setZoom(zoomLvl)) {
        this.setZoom(this._lastValue);
    }
    else if (this.zoomCB){
       this.zoomCB(zoomLvl);
    }
};

/**
 * SelectPageControl constructor
 *
 * @param kwArgs.curPage  [String|Int] Current page number
 * @param kwArgs.numPages [String|Int] Number of pages in report
 */
bobj.crv.newSelectPageControl = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
    kwArgs = UPDATE({id: bobj.uniqueId()}, kwArgs);
    var o = newWidget(kwArgs.id);

    // Constructor args
    o.curPage = kwArgs.curPage;
    o.numPages = kwArgs.numPages;
    
    // Constants
    o.margin = 1;
    o.space = 0;
    o.fieldWidth = 30;
    o.labelWidth = 13 + o.space;
    
    // Construct the input box
    o.intField = newIntFieldWidget(
        o.id + "_intField", 
        null,
        null,
        null,
        function() {
            if (o.selectPageCB){ 
               o.selectPageCB(o.getCurrentPage());
            }
        },
        true,
        L_bobj_crv_SelectPage, 
        o.fieldWidth);
                
    // Construct a label to display numPages        
    o.label = NewLabelWidget (o.id + "_label", " / " + o.numPages);
    
    // Attach member functions
    o.initOld = o.init;
    o.selectPageCB = null;
    UPDATE(o, bobj.crv.SelectPageControl);
    
    o.widgetType = 'SelectPageControl';
    return o;
};

bobj.crv.SelectPageControl.update = function(update, updatePack) {
    if(update && update.cons == "bobj.crv.newSelectPageControl") {
        this.setCurrentPage(update.args.curPage);
        this.setNumPages(update.args.numPages);
    }
};

bobj.crv.SelectPageControl.getHTML = function() {
    var h = bobj.html; 
    
    var labelStyle = {
        cursor: 'default',
        'padding-left': this.space + 'px',
        width: this.labelWidth + 'px'
    };
    
    return h.TABLE({
            id: this.id,
            cellspacing: 0,
            cellpadding: 0,
            border: 0,
            style: {margin: this.margin + 'px'}
        },
        h.TBODY(null,
            h.TR(null,
                h.TD(null, this.intField.getHTML()),
                h.TD({style: labelStyle}, this.label.getHTML() ))));
};

/**
 * @return [Int] Returns the current page number
 */
bobj.crv.SelectPageControl.getCurrentPage = function() {
    return this.intField.getValue();
};

bobj.crv.SelectPageControl.setCurrentPage = function(val) {
    this.intField.setValue(val);
};

/**
 * @return [String] Returns the number of pages label
 */
bobj.crv.SelectPageControl.getNumPages = function() {
    var text = this.label.text || '';
    return text.substring(3); // remove ' / ' from the return value    
};

bobj.crv.SelectPageControl.setNumPages = function(val) {
    this.label.text = ' / ' + val; 
    var labelNode = getLayer(this.label.id);
    labelNode.innerHTML = convStr(this.label.text, false);
};

bobj.crv.SelectPageControl.init = function() {
    this.initOld();
    this.intField.init();
    this.intField.setMin(1);
    this.intField.setValue(this.curPage);
    this.label.init();
};

/**
 * searchTextControl constructor
 *
 * @param kwArgs.searchText  [String] Search Text
 */
bobj.crv.newSearchTextControl = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
    kwArgs = UPDATE({id: bobj.uniqueId()}, kwArgs);
    var o = newWidget(kwArgs.id);
    bobj.fillIn(o, kwArgs);
    // Construct the input box
    o.textField = newTextFieldWidget(
        o.id + "_textField", 
        null,
        null,
        null,
        MochiKit.Base.bind(bobj.crv.SearchTextControl._searchTextCB, o),
        true,
        L_bobj_crv_SearchText, 
        100);
    
    o.searchButton = newIconWidget(
        o.id + "_button", 
        bobj.crvUri('images/toolbar.gif'), 
        MochiKit.Base.bind(bobj.crv.SearchTextControl._searchTextCB, o), 
        null,
        L_bobj_crv_SearchText, 
        16,16,3,bobj.crv.toolbarImageY (bobj.crv.searchIconIndex), bobj.crv.toolbarImageY (bobj.crv.searchIconIndex),3);
    
    // Attach member functions
    o.initOld = o.init;
    o.searchTextCB = null;
    UPDATE(o, bobj.crv.SearchTextControl);
    
    o.widgetType = 'SearchTextControl';
    return o;
};

bobj.crv.SearchTextControl.update = function(update, updatePack) {
    if(update && update.cons == "bobj.crv.newSearchTextControl") {
        this.textField.setValue(update.args.searchText);
    }
};


bobj.crv.SearchTextControl.init = function() {
    this.initOld();
    this.textField.init();
    this.textField.setValue(this.searchText);
    this.searchButton.init();
};

bobj.crv.SearchTextControl.getHTML = function() {
    var h = bobj.html; 
    
    var labelStyle = {
        cursor: 'default',
        'padding-left': this.space + 'px',
        width: this.labelWidth + 'px'
    };
    
    return h.TABLE({
            id: this.id,
            cellspacing: 0,
            cellpadding: 0,
            border: 0,
            style: {margin: this.margin + 'px'}
        },
        h.TBODY(null,
            h.TR(null,
                h.TD(null, this.textField.getHTML()),
                h.TD(null, this.searchButton.getHTML() ))));
};

bobj.crv.SearchTextControl._searchTextCB = function() {
    var text = this.textField.getValue();
    if ((text !== "" || this.searchText != text) && bobj.isFunction(this.searchTextCB)) {
        this.searchTextCB(text);
    }
};
