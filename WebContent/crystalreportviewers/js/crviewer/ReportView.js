/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof(bobj.crv.ReportView) == 'undefined') {
    bobj.crv.ReportView = {};
}

/**
 * ReportView Constructor
 */
bobj.crv.newReportView = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        viewStateId: null,
        isMainReport: false
    }, kwArgs);
    var o = newWidget(kwArgs.id);

    bobj.fillIn(o, kwArgs);  
    o.widgetType = 'ReportView';
    
    o.toolPanel = null;
    o.reportPage = null;
    o.grabber = null;
    
    o._lastPanelWidth = null;
    
    // Attach member functions 
    o.initOld = o.init;
    o.isMainReportFlag = o.isMainReport;
    o.setDisplayOld = o.setDisplay;
    MochiKit.Base.update(o, bobj.crv.ReportView);
    
    return o;    
};

bobj.crv.ReportView.init = function() {
    var connect = MochiKit.Signal.connect;
    var signal = MochiKit.Signal.signal;
    var partial = MochiKit.Base.partial;
    
    this.initOld();
    
    if (this.toolPanel) {
        connect(this.toolPanel, 'grpDrilldown', partial(signal, this, 'grpDrilldown'));
        connect(this.toolPanel, 'grpNodeRetrieveChildren', partial(signal, this, 'grpNodeRetrieveChildren'));
        connect(this.toolPanel, 'grpNodeCollapse', partial(signal, this, 'grpNodeCollapse'));
        connect(this.toolPanel, 'grpNodeExpand', partial(signal, this, 'grpNodeExpand'));
        connect(this.toolPanel, 'paramAdvanced', partial(signal, this, 'paramAdvanced'));
        connect(this.toolPanel, 'paramApply', partial(signal, this, 'paramApply'));
    }
        
    if (this.grabber) {
        this.grabber.init();
        if (!this.toolPanel.isDisplayed()) {
            this.grabber.setDisplay(false);
        }
    }
    
};

bobj.crv.ReportView.addChild = function(widget) {
    var mb = MochiKit.Base;
    var ms = MochiKit.Signal;
    
    if (widget.widgetType == 'ToolPanel') {
        this.toolPanel = widget;   
        ms.connect(this.toolPanel, 'resize', mb.partial(ms.signal, this, 'resizeToolPanel'));
    }
    else if (widget.widgetType == 'ReportPage') {
        this.reportPage = widget;    
    }
};

bobj.crv.ReportView.update = function(update, updatePack) {
    if(update && update.cons == "bobj.crv.newReportView") {
        for(var childVar in update.children) {
            var child = update.children[childVar];
            if(child) {
                switch(child.cons) {
                    case "bobj.crv.newToolPanel":
                        if(this.toolPanel && updatePack.updateToolPanel()) {
                            this.toolPanel.update(child, updatePack);
                        }
                        break;
                    case "bobj.crv.newReportPage":
                        if(this.reportPage && updatePack.updateReportPage()) {
                            this.reportPage.update(child,updatePack);
                        }
                        break;                    
                }
            }
        }
    }
};


bobj.crv.ReportView.getHTML = function() {
    var h = bobj.html;
    
    if (this.toolPanel && this.reportPage) {
        this.grabber = newGrabberWidget(
            this.id + '_grabber', 
            MochiKit.Base.bind(bobj.crv.ReportView._grabberCB, this),
            0, // intial left
            0, // intial top
            4, // width
            1, // intial height (has to be pixels so we'll figure it out later)
            true); // Moves on the horizontal axis
    }
    
    var layerStyle = {
        width:'100%', 
        height:'100%',
        overflow: 'hidden',
        position: 'relative'
    };
    
    var html = h.DIV({id: this.id, style: layerStyle},
        this.toolPanel ? this.toolPanel.getHTML(): '',
        this.grabber ? this.grabber.getHTML() : '',
        this.reportPage ? this.reportPage.getHTML() : '' );
        
    return html + bobj.crv.getInitHTML(this.widx);
};

bobj.crv.ReportView._doLayout = function() {
    if (!this.isDisplayed()) {
        return;    
    }
    
    var panelW = this.toolPanel && this.toolPanel.isDisplayed() ? this.toolPanel.getWidth() : 0; 
    var grabberW = this.grabber && this.grabber.isDisplayed() ? this.grabber.getWidth() : 0; 
    var innerHeight = this.getHeight();
    
    if (this.reportPage) { 
        this.reportPage.resize(this.getWidth() - panelW - grabberW, innerHeight);
        this.reportPage.move(panelW + grabberW, 0);
    }
    
    if (this.grabber && this.grabber.isDisplayed()) {
        this.grabber.resize(null, innerHeight);
        this.grabber.move(panelW, 0);
    }
    
    if (this.toolPanel && this.toolPanel.isDisplayed()) {
        this.toolPanel.resize(null, innerHeight);
    }
}; 

bobj.crv.ReportView.isMainReport = function() {
    return this.isMainReportFlag;
};

/**
 * Private. Handles drag and drop of the resize bar (grabber).
 */
bobj.crv.ReportView._grabberCB = function(x, y) {
    this.toolPanel.resize(x);
    this._doLayout();
};

bobj.crv.ReportView.setDisplay = function(isDisplayed) { 
    this.setDisplayOld(isDisplayed);
    if (isDisplayed) {
        this._doLayout();
    }
};

/**
 * ReportView will always fill its container but it should be told when to 
 * resize so that the layout of its contents will be updated.
 */
bobj.crv.ReportView.resize = function() {
    this._doLayout();
};

/**
 * @return Returns a suggested size for the widget as an object with width and 
 *         height integer properties that specify the dimensions in pixels.
 */
bobj.crv.ReportView.getBestFitSize = function() {
    var w = 0;
    var h = 0;
    
    var pageSize = this.reportPage ? this.reportPage.getBestFitSize() : null;
    if (pageSize) {
        w += pageSize.width;
        h += pageSize.height;
    } else if (this.toolPanel) {
        h += this.toolPanel.getHeight();
    }
    
    if (this.toolPanel) {
        w += this.toolPanel.getWidth();    
    }
    
    if (this.grabber) {
        w += this.grabber.getWidth();    
    }
    
    return {
        width: w,
        height: h
    }
};

/**
 * Shows or hides the tool panel.
 *
 * @param disp [bool]  True value shows panel. False value hides it. 
 */
bobj.crv.ReportView.setDisplayToolPanel = function(disp) {
    if (this.toolPanel) { 
        this.toolPanel.setDisplay(disp);
        
        if (this.grabber) {
            this.grabber.setDisplay(disp);
        }
        
        this._doLayout(); 
        MochiKit.Signal.signal(this, disp ? 'showToolPanel' : 'hideToolPanel');
    }
};

/**
 * @return True if the view has report content. False if the view is empty.
 */
bobj.crv.ReportView.hasContent = function() {
    return this.toolPanel || this.reportPage;    
};

/**
 * TODO 
 * overriding this function from the library because it generated unbalanced tags.
 * need to submit a fix to the official source tree.
 */
function GrabberWidget_getHTML()
// returns [String] widget HTML
{
    var o=this
    var cr=o.isHori?_resizeW:_resizeH
    var moveableCb='onselectstart="return false" ondragstart="return false" onmousedown="'+_codeWinName+'.GrabberWidget_down(event,\''+o.index+'\',this);return false;"'
    var imgG=_ie?('<img onselectstart="return false" ondragstart="return false" onmousedown="'+_codeWinName+'.eventCancelBubble(event)" border="0" hspace="0" vspace="0" src="'+_skin+'../transp.gif" id="modal_'+o.id+'" style="z-index:10000;display:none;position:absolute;top:0px;left:0px;width:1px;height:1px;cursor:'+cr+'">'):('<div onselectstart="return false" ondragstart="return false" onmousedown="'+_codeWinName+'.eventCancelBubble(event)" border="0" hspace="0" vspace="0" id="modal_'+o.id+'" style="z-index:10000;display:none;position:absolute;top:0px;left:0px;width:1px;height:1px;cursor:'+cr+'"></div>')

    return getBGIframe('grabIframe_'+o.id)+imgG+'<table cellpadding="0" cellspacing="0" border="0" '+moveableCb+' id="'+o.id+'" style="overflow:hidden;position:absolute;left:'+o.x+'px;top:'+o.y+'px;width:'+o.w+'px;height:'+o.h+'px;cursor:'+cr+'"><tr><td></td></tr></table>'
}