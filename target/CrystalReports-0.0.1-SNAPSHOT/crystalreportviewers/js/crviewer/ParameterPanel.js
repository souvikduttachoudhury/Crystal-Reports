/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof bobj.crv.params.ParameterPanel == 'undefined') {
    bobj.crv.params.ParameterPanel = {};
    bobj.crv.params.ParameterPanelToolbar = {};
    bobj.crv.params.ParameterTab = {};
    bobj.crv.params.ParameterDialog = {};
}

/*
================================================================================
ParameterPanel
================================================================================
*/

/**
 * Constructor
 */
bobj.crv.params.newParameterPanel = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId() + '_IPPanel'
    }, kwArgs);
    
    var o = newWidget(kwArgs.id);
    o.widgetType = 'ParameterPanel';
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.ParameterPanel);
    
    o._tabPanel = bobj.crv.newStackedPanel({
        id: o.id + '_ParamtersStack'
    });
    o._selected = null;
    
    o._toolbar = bobj.crv.params.newParameterPanelToolbar({
        id: o.id + '_IPToolbar'
    });
    
    return o;
};

bobj.crv.params.ParameterPanel.setToolbarCallBacks = function(delClickCB,applyClickCB)
{
    if(this._toolbar) {
        this._toolbar.delClickCB = delClickCB;
        this._toolbar.applyClickCB = applyClickCB;
    }

};

bobj.crv.params.ParameterPanel.init = function() {
    Widget_init.call(this);
    this._toolbar.init();
    if (this._tabPanel) {
        this._tabPanel.init();
    }
};

bobj.crv.params.ParameterPanel.getHTML = function() {
    var DIV = bobj.html.DIV;
    var layerStyle = this._getCommonLayerStyle();
    layerStyle.overflow = 'hidden';
    
    var innerHTML = this._toolbar.getHTML();
    if (this._tabPanel) {
        innerHTML += this._tabPanel.getHTML();
    }
    
    return DIV({id: this.id, style: layerStyle}, innerHTML);
};

bobj.crv.params.ParameterPanel._getErrorMsgContent = function(errMsg) {
    var DIV = bobj.html.DIV;
    var layerStyle = this._getCommonLayerStyle();
    return DIV({id: this.id, style: layerStyle}, errMsg);
};

bobj.crv.params.ParameterPanel._getCommonLayerStyle = function() {
    var layerStyle = {};
    
    if (this.height) {
        layerStyle.height = bobj.unitValue(this.height);
    }
    
    if (this.width) {
        layerStyle.width =  bobj.unitValue(this.width);
    }
    
    return layerStyle;
};

/**
 * Show error message in the panel.
 * 
 * @param errMsg [string] Error message to be shown
 */
bobj.crv.params.ParameterPanel.showError = function(errMsg) {
    if (errMsg) {
        this.setHTML(this._getErrorMsgContent(errMsg));
    }
};

/**
 * Resize the panel
 * 
 * @param w [int - optional] Width in pixels
 * @param h [int - optional] Height in pixels
 */
bobj.crv.params.ParameterPanel.resize = function(w, h) { 
    Widget_resize.call(this, w, h);

    if (this._toolbar) {
        w = this.layer.clientWidth;
        this._toolbar.resize(w);
        if (this._tabPanel) {
            h = this.layer.clientHeight - this._toolbar.getHeight();
            this._tabPanel.resize(w, h); 
        }
    }
};

/**
 * Add a ParameterUI instance to the panel
 *
 * @param paramUI [ParameterUI] 
 * @param label [String]  Parameter title 
 * @param isDataFetching [bool]  Shows the data fetching icon when true
 * @param isDirty [bool]  Shows the dirty icon when true
 */
bobj.crv.params.ParameterPanel.addParameter = function(kwArgs) { 
    kwArgs = MochiKit.Base.update({
        paramUI: null,
        label: null,
        isDataFetching: false,
        isDirty: false,
        isReadOnly: false,
        selectCB: null,
        openAdvCB: null,
        minMaxTooltip: null,
        id: this._tabPanel.id + '_P' + (this._tabPanel.getNumTabs() + 1)  
    },kwArgs);
        
    if (kwArgs.paramUI) {
        var paramTab = bobj.crv.params.newParameterTab(kwArgs);
        paramTab.setContent(kwArgs.paramUI);
        this._tabPanel.addTab(paramTab);
    }
};

/**
 * Remove a ParameterUI instance from the panel
 *
 * @param index [int] Index of the widget
 */
bobj.crv.params.ParameterPanel.removeParameter = function(index) {
    this._tabPanel.removeTab(index);
};

/**
 * @return [int]  The width, in pixels, of the panel
 */
bobj.crv.params.ParameterPanel.getWidth = function() {
    if (this.layer) {
        return this.layer.offsetWidth;    
    }
    return this.width;
};

bobj.crv.params.ParameterPanel.setDeleteButtonEnabled = function(isEnabled) {
    this._toolbar.delButton.setDisabled(!isEnabled);    
};

bobj.crv.params.ParameterPanel.setApplyButtonEnabled = function(isEnabled) {
    this._toolbar.applyButton.setDisabled(!isEnabled);
};

bobj.crv.params.ParameterPanel.getIndex = function(paramUI) {
    var numTabs = this._tabPanel.getNumTabs();
    for (var idx = 0; idx < numTabs; ++idx) {
        var tab = this._tabPanel.getTab(idx);
        if (tab.getContent() === paramUI) {
            return idx;
        }
    }
    return -1;
};

bobj.crv.params.ParameterPanel.getParameter = function(index) {
    var tab = this._tabPanel.getTab(index);
    if (tab) {
        return tab.getContent();    
    }
    return null;
};

bobj.crv.params.ParameterPanel.setDirty = function(index, isDirty) {
    var tab = this._tabPanel.getTab(index);
    if (tab) {
        tab.setDirty(isDirty);
        tab.getContent().setBgColor ();
    }
};

bobj.crv.params.ParameterPanel.isDirty = function(index) {
    var tab = this._tabPanel.getTab(index);
    if (tab) {
        return tab.isDirty();    
    }
    return false;
};

bobj.crv.params.ParameterPanel.setSelected = function(index, isSelected) {
    var tab = this._tabPanel.getTab(index);
    if (tab) {
        if (this._selected) {
            this._selected.setSelected(false);
        }
        tab.setSelected(isSelected);   
        this._selected = tab;
    }
};

bobj.crv.params.ParameterPanel.expand = function(index) {
    var tab = this._tabPanel.getTab(index);
    if (tab) {
        tab.expand();   
    }
};

/*
================================================================================
ParameterPanelToolbar

Contains the Delete and Run buttons
================================================================================
*/

// these are the Y offsets of the icons in the param_panel.gif image
bobj.crv.paramPanelIcon = bobj.crvUri('images/param_panel.gif');

bobj.crv.paramDataFetchingIconYOffset = 32; // param_datafetching.gif
bobj.crv.paramDirtyIconYOffset = 48; // param_dirty.gif
bobj.crv.paramInfoIconYOffset = 64; // param_info.gif
bobj.crv.paramsApplyIconYOffset = 80; // param_run.gif
bobj.crv.paramsDeleteIconYOffset = 102; // delete.gif

/**
 * Constructor
 */
bobj.crv.params.newParameterPanelToolbar = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId()
    }, kwArgs);
    var o = newPaletteContainerWidget(kwArgs.id);

    bobj.fillIn(o, kwArgs);  
    o.widgetType = 'ParameterPanelToolbar';
    
    // Attach member functions
    o._paletteContainerInit = o.init;
    MochiKit.Base.update(o, bobj.crv.params.ParameterPanelToolbar);
    
    o._palette = newPaletteWidget(o.id + "_palette");
    o.add(o._palette);
    
    var bind = MochiKit.Base.bind;
    
    o.delButton = newIconWidget( 
        o.id + '_delBtn',        
        bobj.crv.paramPanelIcon,   
        bind(o._onDelClick, o), //clickCB,   
        L_bobj_crv_ParamsDelete,//text,      
        L_bobj_crv_ParamsDeleteTooltip,//tooltip,   
        16, 16, 3, 3 + bobj.crv.paramsDeleteIconYOffset, 25, 3 + bobj.crv.paramsDeleteIconYOffset);   //width, height, dx, dy, disDx, disDy     
        
    o.applyButton = newIconWidget( 
        o.id + '_applyBtn',        
        bobj.crv.paramPanelIcon,    
        bind(o._onApplyClick, o), //clickCB,   
        L_bobj_crv_ParamsApply,   //text
        L_bobj_crv_ParamsApplyTip,//tooltip,   
        16, 16, 3, 3 + bobj.crv.paramsApplyIconYOffset, 25, 3 + bobj.crv.paramsApplyIconYOffset);   //width, height, dx, dy, disDx, disDy     
            
    
    o._palette.add(o.applyButton);
    o._palette.add(); // separator
    o._palette.add(o.delButton);
    
    return o;    
};

bobj.crv.params.ParameterPanelToolbar.init = function() {
    this._paletteContainerInit();
    this._palette.init();
    
    this.delButton.setDisabled(true);
    this.applyButton.setDisabled(true);
};

/**
 * Overrides parent. Opens the toolbar's tags.
 */
bobj.crv.params.ParameterPanelToolbar.beginHTML = function()
{
	return bobj.html.openTag('div', {
            id: this.id,
            'class':'dialogzone',
            style:{overflow:'hidden', margin:'0'}});    
};

bobj.crv.params.ParameterPanelToolbar.getHTML = function() {
    return (this.beginHTML() +
        this._palette.getHTML() + 
        this.endHTML() );
};

bobj.crv.params.ParameterPanelToolbar._onDelClick = function() {
    if (this.delClickCB) {
        bobj.crv.logger.info('UIAction ParameterPanel.Delete');
        this.delClickCB();    
    }
};

bobj.crv.params.ParameterPanelToolbar._onApplyClick = function() { 
    if (this.applyClickCB) {
        bobj.crv.logger.info('UIAction ParameterPanel.Apply');
        this.applyClickCB();    
    }
};

/*
================================================================================
ParameterTab

Internal class. Stackable container for a prompt UI. Draws the prompt Title over 
the content.
================================================================================
*/

bobj.crv.params.newParameterTab = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        label: null,
        isDataFetching: false,
        isDirty: false,
        isReadOnly: false,
        minMaxTooltip: null,
        openAdvCB: null,
        selectCB: null,
        id: null
    }, kwArgs);
    
    kwArgs.iconPos = "right";
    kwArgs.expandImgPos = "right";
    
    var o = bobj.crv.newStackedTab(kwArgs);
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    o._isDirtyInit = kwArgs.isDirty;
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.ParameterTab);
    
    o._dirtyId = o.id + '_dirty';
    o.addIcon(bobj.crv.paramPanelIcon, 0, bobj.crv.paramDirtyIconYOffset, L_bobj_crv_ParamsDirtyTip, false, o._isDirtyInit, o._dirtyId);
    
    if(kwArgs.minMaxTooltip || kwArgs.isReadOnly) {
        var tooltip = "";
        if(kwArgs.isReadOnly && kwArgs.minMaxTooltip) {
            tooltip = L_bobj_crv_ParamsReadOnly + "<BR>" + kwArgs.minMaxTooltip;
        }
        else if(kwArgs.minMaxTooltip) {
            tooltip = kwArgs.minMaxTooltip;
        }
        else if(kwArgs.isReadOnly) {
            tooltip = L_bobj_crv_ParamsReadOnly;
        }
        
        o.addIcon(bobj.crv.paramPanelIcon, 0, bobj.crv.paramInfoIconYOffset,tooltip, false, true, o.id + '_icnInfo');
    }
    
    if (o.isDataFetching) {
        o.addIcon(bobj.crv.paramPanelIcon, 0, bobj.crv.paramDataFetchingIconYOffset, L_bobj_crv_ParamsDataTip, true, true, null);
    }
    
    return o;
};

/**
 * Set whether dirty icon is displayed
 *
 * @param isDirty [bool] True shows the icon. False hides it.
 */
bobj.crv.params.ParameterTab.setDirty = function(isDirty) {
    if (isDirty) {
        this.showIcon.call(this, this._dirtyId);
    }
    else {
        this.hideIcon.call(this, this._dirtyId);
    }
};

/**
 * @return [boolean] True if the dirty icon is showing
 */
bobj.crv.params.ParameterTab.isDirty = function() {
    if (this.layer) {
        return  this.isIconShowing(this._dirtyId);
    }
    else {
        return this._isDirtyInit;    
    }
};

/**
 * @return [boolean] True if the tab is selected.
 */
bobj.crv.params.ParameterTab.isSelected = function() {
    return  MochiKit.DOM.hasElementClass(this._labelCtn, 'iactParamLabelSel');
};

/**
 * Select or deselect the tab
 *
 * @param isSelected [bool] True selects the tab. False deselects it.
 */
bobj.crv.params.ParameterTab.setSelected = function(isSelected) { 
    if (isSelected) {
        MochiKit.DOM.addElementClass(this._labelCtn, 'iactParamLabelSel');
    }
    else {
        MochiKit.DOM.removeElementClass(this._labelCtn, 'iactParamLabelSel');
    }
};

/*
================================================================================
ParameterDialog

Advanced Dialog for editing parameters using the prompt engine
================================================================================
*/

bobj.crv.params.newParameterDialog = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        prompt: null,
        promptHTML: '',
        showCB : null,
        hideCB : null
    }, kwArgs);  
    
    var o = newDialogBoxWidget(
        kwArgs.id, 
        L_bobj_crv_ParamsDlgTitle, 
        kwArgs.width, 
        kwArgs.height /*,defaultCB,cancelCB,noCloseButton*/);

    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    
    // Update instance with member functions
    o._showDialogBox = o.show;
    o._initDialogBox = o.init;
    MochiKit.Base.update(o, bobj.crv.params.ParameterDialog);
    
    return o;
};

bobj.crv.params.ParameterDialog.init = function() {
    this._initDialogBox();
    this._form = document.getElementById(this.id + '_form');
};

bobj.crv.params.ParameterDialog._checkInitialization= function() {
    if(!this.layer) {
       targetApp(this.getHTML());
       this.init();       
    }
};

bobj.crv.params.ParameterDialog.show = function(show) {
    if (show) {
        this._checkInitialization();
        this.setResize(MochiKit.Base.noop);
        this._showDialogBox(true);
    } 
    else if (this.layer){
        this._showDialogBox(false);
    }
    
    if(show && this.showCB) {
    	this.showCB();
    }
    else if(!show && this.hideCB) {
    	this.hideCB();
    }
};

bobj.crv.params.ParameterDialog.isVisible = function() {
	return (this.initialized() && this.isDisplayed());
};

bobj.crv.params.ParameterDialog.setPromptHTML = function(html) { 
    
    if (html) {           
        this._checkInitialization();
        
        if(this.isDisplayed()) {
            this._showDialogBox(false);
        }
          
        this._deleteScripts();
        
        var ext = bobj.html.extractHtml(html);
        this.promptHTML = ext.html;
        
        if (this._form) {
            this._form.innerHTML = '<div style="overflow:auto">' + this.promptHTML + '</div>';
        }
        
        var links = ext.links;
        for(var iLinks = 0, linksLen = links.length; iLinks < linksLen; ++iLinks)
        {
            bobj.includeLink(links[iLinks]);
        }
        
        var winScroll_before = {x: getScrollX() , y : getScrollY()};
        
        var scripts = ext.scripts;
        for (var iScripts = 0, scriptsLen = scripts.length; iScripts < scriptsLen; ++iScripts) {
            var script = scripts[iScripts];
            if (!script) {continue;}
            
            if (script.text) {
                bobj.evalInWindow(script.text);
            }
        }
        
        var winScroll_after = {x: getScrollX() , y : getScrollY()};
        
        if(winScroll_before.x != winScroll_after.x || winScroll_before.y != winScroll_after.y) {
            _curWin.scrollTo(winScroll_before.x, winScroll_before.y);
        }        
    }
};

/**
 * Private. Deletes global scope objects that were created for the dialog
 */
bobj.crv.params.ParameterDialog._deleteScripts = function() {
    var form = this._form;
    if (form && form.ContextHandleID) {
        var prefix = form.ContextHandleID.value;
        for (var i in window) {
            if (i.indexOf(prefix) === 0) {
                delete window[i];    
            }
        }
    }
};

bobj.crv.params.ParameterDialog.getHTML = function(html) {
    var FORM = bobj.html.FORM;
    
    var onsubmit = 'eventCancelBubble(event);return false;';
    
    return this.beginHTML() +
        FORM({id: this.id + '_form', onsubmit: onsubmit}, this.promptHTML) +
        this.endHTML();    
};
