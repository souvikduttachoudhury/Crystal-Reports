/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof(bobj.crv.ReportAlbum) == 'undefined') {
    bobj.crv.ReportAlbum = {};
}

if (typeof(bobj.crv.Tab) == 'undefined') {
    bobj.crv.Tab = {};
}

if (typeof(bobj.crv.TabBar) == 'undefined') {
    bobj.crv.TabBar = {};
}

if (typeof(bobj.crv.ButtonList) == 'undefined') {
    bobj.crv.ButtonList = {};
}


/**
 * ReportAlbum Constructor
 */
bobj.crv.newReportAlbum = function(kwArgs) {
    var mb = MochiKit.Base;
    var UPDATE = mb.update;
    var BIND = mb.bind;
    var ALBUM = bobj.crv.ReportAlbum;
    
    kwArgs = UPDATE({
        id: bobj.uniqueId(),
        initTabIdx: 0, // Index of tab to select when initializing
        width: 800,
        height: 500,
        displayDrilldownTab : true
    }, kwArgs);
    
    var o = newTabbedZone(kwArgs.id, null, kwArgs.width, kwArgs.height);

    // Override TabbedZone's TabBarWidget
    o.tabs = bobj.crv.newTabBar({displayDrilldownTab : kwArgs.displayDrilldownTab});
    o.tabs.removeCB = BIND(ALBUM._onCloseTab, o);
    o.tabs.selectCB = BIND(ALBUM._onSelectTab, o);

    bobj.fillIn(o, kwArgs);  
    o.widgetType = 'ReportAlbum';
    o._children = [];
    o._curView = null;
    o._curSigs = [];
    
    // Attach member functions 
    o.selectOld = o.select;
    UPDATE(o, ALBUM);
    
    return o;    
};

bobj.crv.ReportAlbum.init = function() {
    var connect = MochiKit.Signal.connect;
    var signal = MochiKit.Signal.signal;
    var partial = MochiKit.Base.partial;
    
    // This is not nice... Copied super class' init code here so that select 
    // will be called only once.
    this.tzOldInit();
    this.tabs.init();
    
    if (this._children.length) {
        if (this.initTabIdx < 0 || this.initTabIdx >= this._children.length) {
            this.initTabIdx = 0;
        }
            
        this.select(this.initTabIdx);
        connect(this._curView, 'grpDrilldown', partial(signal, this, 'grpDrilldown')); 
        connect(this._curView, 'grpNodeRetrieveChildren', partial(signal, this, 'grpNodeRetrieveChildren'));
        connect(this._curView, 'grpNodeCollapse', partial(signal, this, 'grpNodeCollapse'));
        connect(this._curView, 'grpNodeExpand', partial(signal, this, 'grpNodeExpand'));
        connect(this._curView, 'paramAdvanced', partial(signal, this, 'paramAdvanced'));
        connect(this._curView, 'paramApply', partial(signal, this, 'paramApply'));
    }
};

bobj.crv.ReportAlbum.update = function(update, updatePack) {
    if(update && update.cons == "bobj.crv.newReportAlbum" && this.getSelectedView()) {
        var update_activeView = update.children[update.args.initTabIdx];
        if(update_activeView) {
            if(update_activeView.args.viewStateId == this.getSelectedView().viewStateId) {
                this.getSelectedView().update(update_activeView, updatePack);
            }
        }
    }
};

bobj.crv.ReportAlbum.addChild = function(widget) {
    if (widget) {
        this._children.push(widget);
        this.add(widget.label, widget.tooltip);
    }
};

bobj.crv.ReportAlbum.getHTML = function() {
    var html = this.beginHTML();
    var children = this._children;
    for (var i = 0, len = children.length; i < len; ++i) {
        html += this.beginTabHTML(i);
        html += children[i].getHTML();
        html += this.endTabHTML();
    }
    
    html += this.endHTML();
    return html + bobj.crv.getInitHTML(this.widx);
};

/**
 * Resize the outer dimensions of the ReportAlbum. The standard resize method,
 * inherited from TabbedZoneWidget, resizes the container. We can't override it
 * without breaking things. 
 */
bobj.crv.ReportAlbum.resizeOuter = function(w, h) {
    // TabbedZoneWidget uses the numeric literals 10 and 33 to increase its
    // width and height beyond those passed to resize.
    var ISNUMBER = bobj.isNumber;
    
    if (ISNUMBER(w)) {
        w = Math.max(0, w - 10);
    }
    if (ISNUMBER(h)) {
        h = Math.max(0, h - 33);
    }
    
    this.resize(w, h);
    this.tabs.resize(w);
    
    if (this._curView) {
        this._curView.resize(); // Notify ReportView of resize
    }
};

/**
 * @return Returns a suggested size for the widget as an object with width and 
 *         height integer properties that specify the dimensions in pixels.
 */
bobj.crv.ReportAlbum.getBestFitSize = function() {
    var w = 10; // Numeric literal from TabbedZoneWidget
    var h = 33; // Numeric literal from TabbedZoneWidget
    
    if (this._curView){
        var viewSize = this._curView.getBestFitSize();
        w += viewSize.width;
        h += viewSize.height;
    }
    
    return {
        width: w,
        height: h
    };
};

/**
 * Overrides parent. Opens a tab with a positioned div. The positioning prevents
 * the ReportView from disappearing in IE.
 */
bobj.crv.ReportAlbum.beginTabHTML = function(index){
    return bobj.html.openTag('div', {
        id: 'tzone_tab_' + index + '_' + this.id,
        style: {
            display: 'none',
            width: this.w + 'px',
            height: this.h + 'px',
            position: 'relative'
        }
    });
};

/**
 * @return Returns the select ReportView or null if no view is selected
 */
bobj.crv.ReportAlbum.getSelectedView = function() {
    return this._curView;
};

/**
 * @return Returns true if the selected view has a tool panel and it's displayed
 */
bobj.crv.ReportAlbum.isToolPanelDisplayed = function() {
    return this._curView && this._curView.toolPanel && this._curView.toolPanel.isDisplayed();    
};

/**
 * Set the display state of the tool panel in the current view, if it exists.
 *
 * @param disp  [bool]  The new display state of the active tool panel 
 */
bobj.crv.ReportAlbum.setDisplayToolPanel = function(disp) {
    if (this._curView) {
        this._curView.setDisplayToolPanel(disp);   
    }
};

/**
 * Overrides parent. Selects a report view to display.
 *
 * @param index [int]  Index of the report view
 */
bobj.crv.ReportAlbum.select = function(index) {
    var ms = MochiKit.Signal;
    var DISCONNECT = ms.disconnect;
    var CONNECT = ms.connect;
    var SIGNAL = ms.signal;
    
    if (index >= 0 && index < this._children.length) {
        var curSigs = this._curSigs;
        while (curSigs.length) {
            DISCONNECT(curSigs.pop());
        }
    
        this._curView = this._children[index];

        var _self = this;
        
        curSigs.push(CONNECT(
            this._curView, 
            'hideToolPanel',
            function () {SIGNAL(_self, 'hideToolPanel');} ));
            
        curSigs.push(CONNECT(
            this._curView, 

            'resizeToolPanel',
            function (width) {SIGNAL(_self, 'resizeToolPanel', width);} ));
            
        this.selectOld(index);
    }
};

/**
 * Remove a view from the album
 *
 * @param index [int]  Index of the view to remove
 */
bobj.crv.ReportAlbum.remove = function(index) {
    var viewCtnr = this.zoneLayers[index];
    if (viewCtnr && viewCtnr.parentNode) {
        viewCtnr.parentNode.removeChild(viewCtnr);
    }
    
    arrayRemove(this, 'zoneLayers', index);
    arrayRemove(this, '_children', index);
    
    var newIdx = this.tabs.getSelection();
    if (newIdx >= 0) {
        this.select(newIdx);
    }
};

/**
 * Private. Handles tab close events.
 */
bobj.crv.ReportAlbum._onCloseTab = function(tab, index) { 
    var SIGNAL = MochiKit.Signal.signal;
    var view = this._children[index];
    this.remove(index);
    SIGNAL(this, 'removeView', view);
    SIGNAL(this, 'selectView', this._curView);
};

/**
 * Private. Handles tab select events.
 */
bobj.crv.ReportAlbum._onSelectTab = function(tab, index) {
    this.select(index);
    MochiKit.Signal.signal(this, 'selectView', this._curView);
};

//** Tab Widget ****************************************************************

/**
 * Tab Constructor
 */
bobj.crv.newTab = function(kwArgs) {
    var update = MochiKit.Base.update; 
    
    kwArgs = update({
        id: bobj.uniqueId(),
        hasCloseBtn: true,
        closeCB: null,
        tabWidth: 50  // Width of tabs (will shrink when there's not enough room) 
    }, kwArgs);
    
    kwArgs.isTop = true; // bottom tabs are not supported
    
    var o = newTabWidget(
        kwArgs.id,
        kwArgs.isTop,
        kwArgs.label,
        kwArgs.clickCB,
        kwArgs.value,
        kwArgs.icon,
        kwArgs.iconW,
        kwArgs.iconH,
        kwArgs.iconOffX,
        kwArgs.iconOffY,
        kwArgs.dblClickCB,
        kwArgs.alt); 
   
   o._crvTabOldInit = o.init;
   o._closeBtn = null;
   
   bobj.fillIn(o, kwArgs);
   update(o, bobj.crv.Tab);
        
   return o;
};

/**
 * Private. Image sizes and offsets. 
 */
bobj.crv.Tab._imageOffsets = {
    closeBtn: {
        normal: {x:0, y:18, w:18, h:18},
        mouseOver: {x:0, y:0, w:18, h:18}    
    },
    tab: {
        top: {
            selected: {
                left: {x:0, y:0, w:15, h:24},
                middle: {x:0, y:24},
                right: {
                    normal: {x:0, y:48, w:15, h:24},
                    narrow: {x:10, y:48, w:5, h:24}
                }
            },
            unselected: {
                left: {x:0, y:72, w:15, h:24},
                middle: {x:0, y:96},
                right: {
                    normal: {x:0, y:120, w:15, h:24},
                    narrow: {x:10, y:120, w:5, h:24}
                }
            }
        }
    }
};

bobj.crv.Tab.init = function() {
    var bind = MochiKit.Base.bind;
    var TAB = bobj.crv.Tab;
    
    this._crvTabOldInit();
    
    var closeBtn = getLayer('tabWidgetCloseBtn_' + this.id);
    if (closeBtn) {
        closeBtn.onmouseover = bind(TAB._onCloseBtnMouseOver, this);
        closeBtn.onmouseout = bind(TAB._onCloseBtnMouseOut, this);
        closeBtn.parentNode.onclick = bind(TAB._onCloseBtnClick, this);
    }
    
    this._closeBtn = closeBtn;
};

/**
 * Private. Highlights the close button on mouseover.
 */
bobj.crv.Tab._onCloseBtnMouseOver = function() {
    var off = this._imageOffsets.closeBtn.mouseOver;
    changeOffset(this._closeBtn, off.x, off.y);
};

/**
 * Private. Removes highlight from close button on mouseout.
 */
bobj.crv.Tab._onCloseBtnMouseOut = function() {
    var off = this._imageOffsets.closeBtn.normal;
    changeOffset(this._closeBtn, off.x, off.y);    
};

/**
 * Private. Delegates close button clicks to the attached callback.
 */
bobj.crv.Tab._onCloseBtnClick = function() {
    if (this.closeCB) { 
        this.closeCB();
    }
};

bobj.crv.Tab.getHTML = function() {
    
    var o = this;
    
    var update = MochiKit.Base.update;
    var h = bobj.html;
    var off = this._imageOffsets;
    
    var cls = "thumbtxt" + (o.isSelected ? "sel" : "");
    var cb = _codeWinName + ".TabWidget_clickCB('" + o.id + "');return false";
    var dblcb = _codeWinName + ".TabWidget_dblclickCB('" + o.id + "');return false";
    var keycb = _codeWinName + ".TabWidget_keyDownCB('" + o.id + "',event);";
    var menu = _codeWinName + ".TabWidget_contextMenuCB('" + o.id + "',event);return false";
    var icon = o.icon ? o.icon : _skin + "../transp.gif";
    var iconTDWidth = o.icon ? 3 : 0;
    
    // Choose image offsets for the tab based on whether the tabs is selected
    // and whether it's a top or bottom tab
    var tabOff = off.tab[this.isTop ? 'top': 'bottom'];
    tabOff = tabOff[this.selected ? 'selected' : 'unselected'];
    
    var lOff = tabOff.left;
    var rOff = tabOff.right[this.hasCloseBtn ? 'narrow' : 'normal'];
    var mOff = tabOff.middle;
    
    var cBtOff = off.closeBtn.normal; 
    
    // Attributes for the tab's outermost tag
    var widgetAtts = {
        onmouseover: 'return true;', 
        onclick: cb, 
        id: this.id,
        ondblclick: dblcb,
        onkeydown: keycb,
        oncontextmenu: menu,
        style: {cursor: _hand},
        cellspacing: '0',
        cellpadding: '0',
        border: '0'
    };
    
    // Styles applied to the label cell and close button cell 
    var midCellStyle = {
        'background-image': "url('" + _skin + "tabs.gif')",
        'background-position': (-mOff.x) + 'px '+ (-mOff.y) + 'px'
    };
    if (this.isTop) {
        midCellStyle['padding-top'] = '1px';
    }
    else {
        midCellStyle['padding-bottom'] = '3px';
    }
    
    // Style properties for the table that contains the tab's icon
    var imgCellStyle = update({
        'padding-right:': iconTDWidth + 'px',
        'width': (this.iconW + iconTDWidth),
        'align': "left"
    }, midCellStyle);
    if (this.isTop) {
        imgCellStyle['padding-top'] = '1px';
    }
    else {
        imgCellStyle['padding-bottom'] = '2px';
    }
    
    // Styles aplied to the cel that contains the close button
    var closeCellStyle = update({
        display: this.hasCloseBtn ? '' : 'none'    
    }, midCellStyle);
    
    // Create html for the tab
    var html = h.TABLE(widgetAtts,
        h.TBODY(null,
            h.TR({ valign: "middle", height: lOff.h},
                h.TD({width: lOff.w},
                    imgOffset(_skin + 'tabs.gif', lOff.w, lOff.h, lOff.x, lOff.y, "tabWidgetLeft_" + o.id)),
                h.TD({id: 'tabWidgetImg_' + o.id, style:imgCellStyle},
                    imgOffset(icon, o.iconW, o.iconH, o.iconOffX, o.iconOffY, "tabWidgetIcon_" + o.id, null, o.iconAlt)),
                h.TD({width: o.tabWidth, id: 'tabWidgetMid_' + this.id, style: midCellStyle},
                    h.SPAN({style:{'white-space': 'nowrap'}},
                        lnk(convStr(o.name,true), null, cls, "tabWidgetLnk_" + o.id))),
                h.TD({width: cBtOff.w, id: 'tabWidgetClose_' + o.id, style: closeCellStyle},
                    h.A({href: 'javascript:void(0)', title:L_bobj_crv_Close},
                        imgOffset(_skin + 'dialogelements.gif', cBtOff.w, cBtOff.h, cBtOff.x, cBtOff.y, "tabWidgetCloseBtn_" + o.id))),
                h.TD({width: rOff.w},
                    imgOffset(_skin + 'tabs.gif', rOff.w, rOff.h, rOff.x, rOff.y, "tabWidgetRight_" + o.id)))));
                    
    return html;
};

/**
 * Override's parent so that close button's cell is also changed.
 * 
 * @see TabWidget_changeContent
 */
bobj.crv.Tab.changeContent = function(changeOnlySelection) {
    var o = this;
    
    // Get layers
    if (!o.lnkLayer) {
        o.lnkLayer = getLayer("tabWidgetLnk_" + o.id);
        o.leftImgLayer = getLayer("tabWidgetLeft_" + o.id);
        o.rightImgLayer = getLayer("tabWidgetRight_" + o.id);
        o.midImgLayer = getLayer("tabWidgetMid_" + o.id);
        o.imgImgLayer = getLayer("tabWidgetImg_" + o.id);
        o.closeImgLayer = getLayer("tabWidgetClose_" + o.id);
        o.iconLayer = getLayer("tabWidgetIcon_" + o.id);
    }
    
    // Change icon and text
    if (!changeOnlySelection) {
        o.lnkLayer.innerHTML = convStr(o.name, true);
        var iconLayer = o.iconLayer;
        changeOffset(iconLayer, o.iconOffX, o.iconOffY, o.icon ? o.icon: _skin + "../transp.gif");
        iconLayer.alt = o.iconAlt;
    
        iconLayer.style.width = "" + o.iconW + "px";
        iconLayer.style.height = "" + o.iconH + "px";
        
        var iconTDWidth = o.icon ? 3: 0;
        var imgL = o.imgImgLayer;
        imgL.style.paddingRight = "" + iconTDWidth + "px";
    
        imgL.style.width = "" + (iconTDWidth + ((o.icon && bobj.isNumber(o.iconW)) ? o.iconW : 0)) + "px";
        if (_moz && !_saf) {
            imgL.width = (iconTDWidth + ((o.icon && bobj.isNumber(o.iconW)) ? o.iconW : 0));
        }
    }
    
    var off = this._imageOffsets;
    var tabOff = off.tab[this.isTop ? 'top': 'bottom'];
    tabOff = tabOff[this.isSelected ? 'selected' : 'unselected'];
    
    var lOff = tabOff.left;
    var rOff = tabOff.right[this.hasCloseBtn ? 'narrow' : 'normal'];
    var mOff = tabOff.middle;
    
    changeOffset(o.leftImgLayer, lOff.x, lOff.y);
    changeOffset(o.midImgLayer, mOff.x, mOff.y);
    changeOffset(o.closeImgLayer, mOff.x, mOff.y);
    changeOffset(o.imgImgLayer, mOff.x, mOff.y);
    changeOffset(o.rightImgLayer, rOff.x, rOff.y);
    
    o.lnkLayer.className = "thumbtxt" + (o.isSelected ? "sel" : "");
};

//** TabBar Widget *************************************************************

/**
 * TabBar Constructor
 */
bobj.crv.newTabBar = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
    kwArgs = UPDATE({
        id: bobj.uniqueId(),
        removeCB: null,     // function to call when tab is removed
        selectCB: null,      // function to call when tab is selected
        displayDrilldownTab : true
    }, kwArgs);
    
    kwArgs.isTop = true; // Bottom tabs are not supported
    
    var o = newWidget(kwArgs.id);
    bobj.fillIn(o, kwArgs);  
    o.widgetType = 'TabBar';
    
    o._tabs = [];
    o._tabRowLayer = null;
    o._tabBarLayer = null;
    o._selIndex = 0;
    o._tabBarOldInit = o.init;
    o._tabBarOldResize = o.resize;
    o._selTabXOffset = 0; // Number of pixels of the the tab left of the 
                          // selected tab that should be visible after scrolling
    o._menuBtnWidth = 24;
    
    var bind = MochiKit.Base.bind;
    
    o._tabMenuBtn = bobj.crv.newButtonList({
        id: o.id + '_sel',
        buttonWidth: o._menuBtnWidth, 
        changeCB: bind(bobj.crv.TabBar._onMenuChange, o)
    });
    
    UPDATE(o, bobj.crv.TabBar);
    
    return o;
};


bobj.crv.TabBar.init = function() {
    this._tabBarOldInit();
    
    if (this._tabMenuBtn){
        this._tabMenuBtn.init();
    }
    
    if(this.displayDrilldownTab === false) {
        this.hide();
    }
    
    this._tabRowLayer = getLayer(this.id + '_tabRow');
    this._tabBarLayer = getLayer(this.id + '_tabBar');
    this._tabCtnLayer = this._tabBarLayer.parentNode;
    this._tabSelLayer = getLayer(this.id + '_tabSel');
    
    for (var i = 0; i < this._tabs.length; ++i){
        var tab = this._tabs[i];
        tab.init();
        tab.select(i == this._selIndex);
    }
    
    setTimeout(MochiKit.Base.bind(this._setMenuVis, this), 0); 
};

/**
 * Add a tab to the bar. 
 * 
 * @param label    [String]  Tab label
 * @param value    [String - optional] a value that is used to find it again
 * @param icon     [String - optional] an image URL
 * @param iconW    [int - optional]    displayed image width
 * @param iconH    [int - optional]    displayed image height
 * @param iconOffX [int - optional]    x offset in the icon (for combined images)
 * @param iconOffY [int - optional]    y offset in the icon (for combined images)
 * @param hasCloseBtn [bool - optional]   When true, tab has a close button. Defaults 
 *                                     to false for first tab and true for others
 */
bobj.crv.TabBar.add = function(label, value, idx, icon, iconW, iconH, iconOffX, iconOffY, alt, hasCloseBtn) {
    var kwArgs = {
        label: label,
        value: value,
        idx : idx,
        icon: icon,
        iconW : iconW,
        iconH: iconH,
        iconOffX: iconOffX,
        iconOffY: iconOffY,
        alt: alt,
        isTop: this.isTop
    };
    
    if (bobj.isBoolean(hasCloseBtn)) {
        kwArgs.hasCloseBtn = hasCloseBtn;    
    }
    else {
        kwArgs.hasCloseBtn = (this._tabs.length ? true : false);    
    }
    
    return this.kwAdd(kwArgs); 
};

/**
 * Add a tab using keyword arguments. Must be called before getHTML is called.
 *
 * @see bobj.crv.TabBar.add
 */
bobj.crv.TabBar.kwAdd = function(kwArgs) {
    var bind = MochiKit.Base.bind;
    
    kwArgs.id = bobj.uniqueId();
    
    var tab = bobj.crv.newTab(kwArgs); 
    tab.cb = bind(this._onTabClick, this, tab);
    tab.closeCB = bind(this._onTabCloseBtnClick, this, tab);

    this._tabs.push(tab);
    this._tabMenuBtn.add(kwArgs.label); 
    
    return tab;
};

/**
 * Removes a tab
 * 
 * @param tab [Tab or Number] A tab in the bar or the index of a tab in the bar
 */
bobj.crv.TabBar.remove = function(tab) {
    var o = this;
    var items = o._tabs;
    var len = items.length;
    
    var idx = bobj.isNumber(tab) ? tab : this.getIndex(tab);
    
    if (idx >= 0 && idx < len) {
        var elem = items[idx];
        var l = elem.layer;
    
        arrayRemove(o, "_tabs",idx);
        o._tabMenuBtn.getMenu().del(idx);
                    
        items = o._tabs;
        len = items.length;
    
        if (l) {
            // we used to remove the layer from the DOM but for whatever reason
            // this would cause the next request to be aborted in IE6
            l.parentNode.style.display = 'none';
        }
    
        o._setMenuVis();
        
        if (o._selIndex > idx) {
            o.select(o._selIndex - 1);
        }
        else if (o._selIndex == idx && len > 0) {
            o.select(Math.min(idx, len - 1));
        }
        else {
            o.select(o._selIndex);    
        }
    }
};
bobj.crv.TabBar.hide = function()
{
    try {
        var parent1 = this.layer.parentNode; // TD
        var parent2 = parent1.parentNode; // TR
        parent2.style.display = 'none';
    }
    catch(ex) {
            if (bobj.crv.config.isDebug) {
            throw ex;    
        }
    }
    


};
/**
 * @return [int] The index of a tab in the tab bar or -1 if the tab is not found 
 */
bobj.crv.TabBar.getIndex = function(tab) {
    return MochiKit.Base.findIdentical(this._tabs, tab);    
};

/**
 * @return [int] The index of the selected tab
 */
bobj.crv.TabBar.getSelection = function() {
    return this._selIndex;
};


/**
 * @return [int] The number of tabs in the bar
 */
bobj.crv.TabBar.getCount = function() {
    return this._tabs.length;    
};

/**
 * @return [Tab] The tab at the specified index or undefined for an invalid index
 */
bobj.crv.TabBar.getTabAt = function(index) {
    return this._tabs[index];
};

/**
 * Select a tab
 *
 * @param tab [Number]  index of tab to select
 */
bobj.crv.TabBar.select = function(tab) {
    if (!bobj.isNumber(tab)) {
        tab = this.getIndex(tab);    
    }
    
    if (bobj.isNumber(tab)) { 
        var index = tab;
        var len = this._tabs.length;
        
        if (index == -1) {
            if (this._selIndex >= 0 && this._selIndex < len) {
                return; // if there is already a valid selection keep it
            }
            
            index = 0; // there wasn't a valid selection so lets select the MainReport
        }
        
        if (index >= 0 && index < len) {
            if (this._selIndex >= 0 && this._selIndex != index && this._selIndex < len) {
                this._tabs[this._selIndex].select(false);
            }
            
            this._selIndex = index;
            this._tabs[index].select(true);
            
            if (this._tabMenuBtn) {
                this._tabMenuBtn.getMenu().select(index); 
            }
            
            this.scroll(null, this._selIndex);
        }
    }
};

/**
 * Resize the tab bar
 *
 * @param w [int]  Width in pixels
 * @param h [int]  Height in pixels
 */
bobj.crv.TabBar.resize = function(w, h) {
    this._tabBarOldResize(w, h);
    
    if (bobj.isNumber(w) && this._tabBarLayer) {
        this._tabCtnLayer.style.width = Math.max(0, w) + 'px';
        this._setMenuVis();
        this.scroll(this._selIndex);
    }
};

/**
 * Private. Shows the tab menu button when there are too many tabs and hides it
 * when there's enough space for all tabs.
 */
bobj.crv.TabBar._setMenuVis = function() { 
    var bar = this._tabBarLayer; 
    var ctn = this._tabCtnLayer;
    var sel = this._tabSelLayer;
    
    if (bar && ctn && sel) {  
        if (ctn.offsetWidth < bar.offsetWidth) {
            // Show the tab selector menu button
            sel.style.display = '';
        }
        else { 
            // Hide the tab selector menu button
            sel.style.display = 'none';
        }
    }
};

/**
 * Scroll the tab bar to make the specified tab visible.
 *
 * @param tab Can be any of the following:
 *     [Tab]    The tab widget to make visible
 *     [Number] The index of a tab to make visible 
 *     [String] 'first', 'previous', next, and 'last' are accepted
 *
 * @param idx [Number] (deprecated) If a null value is passed for tab, idx will
 *                     be checked. 
 */
bobj.crv.TabBar.scroll = function(tab, idx) {
    if (!this._tabBarLayer) {
        return;
    }
    
    idx = bobj.isNumber(idx) ? idx : -1;
    
    if (bobj.isString(tab)) {
        if (tab == 'first') { 
            idx = 0;
        }
        else if (tab == 'previous'){
            idx = this._selIndex - 1;
        }
        else if (tab == 'next'){ 
            idx = this._selIndex + 1;
        }
        else if (tab == 'last'){ 
            idx = this.getCount() - 1;
        }
    }
    else if (bobj.isNumber(tab)) {
        idx = tab;    
    }
    else if (tab) {
        idx = this.getIndex(tab);    
    }

    if (idx >= 0 && idx < this.getCount()) {    
        var bar = this._tabBarLayer; // The tab bar 
        var barCtn = bar.parentNode; // The bar's container 
        var barStyle = bar.style;
         
        // Left and right edges of the entire tab bar relative to its container
        var barLeftX = parseInt(barStyle.left, 10) || 0; 
        var barRightX = barLeftX + bar.offsetWidth;
        
        // Left and right edges of the tab relative to the bar's container
        var tabLeftX = this._getItemXPos(idx) + barLeftX; 
        var tabRightX = tabLeftX + this.getTabAt(idx).getWidth();
        
        // Width of the tab bar container's visible area 
        var visAreaW = barCtn.offsetWidth - this._tabMenuBtn.getWidth();
        
        var scroll = 0;
        
        if (tabLeftX < 0) {
            // Scroll the tab bar to the right    
            scroll = (-1 * tabLeftX);
        }
        else if (tabRightX > visAreaW){
            // Scroll the tab bar to the left    
            scroll = -(tabRightX - visAreaW);
        }
        else if (barRightX < visAreaW && barLeftX < 0) {
            // There's room in the container and not all tabs are visible
            scroll = Math.min(visAreaW - barRightX, -barLeftX);
        }
        
        if (scroll) {
            barStyle.left = (barLeftX + scroll) + 'px';
        }
    }
};

bobj.crv.TabBar.getHTML = function() {
    var h = bobj.html;
    
    var barHeight = 24;
    
    var wgtStyle = {
        height: barHeight + 'px',
        overflow: 'hidden',
        width: '100%',
        position: 'relative'
    };
        
    var barStyle = {
        position: 'relative'
    };
    
    var selDivStyle = {
        width: this._menuBtnWidth + 'px',
        height: barHeight + 'px',
        display: 'none',
        position: 'absolute',
        top: '0px',
        right: '0px',
        'padding-top': '3px'
    };
    
    var tabsHtml = '';
    
    for (var i = 0; i < this._tabs.length; ++i) {
        tabsHtml += h.TD(null, this._tabs[i].getHTML());
    }
    
    var widgetHtml = h.DIV({id: this.id, style: wgtStyle}, 
        h.TABLE({cellspacing: '0', cellpadding: '0', border: '0', style: {width: '100%'}},
            h.TBODY(null, 
                h.TR({valign: 'bottom', height: barHeight},
                    h.TD(null,
                        h.DIV({style: {overflow:'hidden', position:'relative'}},
                            h.TABLE({id: this.id + '_tabBar', style: barStyle, cellspacing:'0', cellpadding:'0', border:'0'},
                                h.TBODY(null,
                                    h.TR({id: this.id + '_tabRow'}, tabsHtml)))))))),
        h.DIV({id: this.id + '_tabSel', 'class': 'panelzone', style: selDivStyle}, this._tabMenuBtn.getHTML())); 

    return widgetHtml;
};

/**
 * Private. Selects a tab when it's clicked.
 */
bobj.crv.TabBar._onTabClick = function(tab) { 
    var idx = this.getIndex(tab);
    
    if (idx < 0)
        return; // the tab has been removed

    this.select(idx);
    if (this.selectCB) {
        this.selectCB(tab, idx);    
    }
};

/**
 * Private. Removes a tab when its close button is clicked.
 */
bobj.crv.TabBar._onTabCloseBtnClick = function(tab) {
    var idx = this.getIndex(tab);
    this.remove(idx);
    if (this.removeCB) {
        this.removeCB(tab, idx);
    }
};

/**
 * Private. Selects the associated tab when the tab menu selection changes.
 */
bobj.crv.TabBar._onMenuChange = function() {
    var menu = this._tabMenuBtn.getMenu();
    if (menu) {
        var selected = menu.getSelection();
        if (selected) {
            this.select(selected.index);
            if (this.selectCB) {
                this.selectCB(this.getTabAt(selected.index), selected.index);    
            }
        }
    }    
};

/**
 * Private. Caculates the left (x) offset of a tab within the tab bar.
 */
bobj.crv.TabBar._getItemXPos = function(index) {
    var x = 0;
    for (var i = 0; i < index; i++){
        x += parseInt(this._tabs[i].getWidth(), 10);
    }
    return x;
};

//** ButtonList Widget *************************************************************

/**
 * ButtonList Constructor
 */
bobj.crv.newButtonList = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        numLines: null, // null allows the height to grow (will fit within the viewport)
        buttonWidth: 24,
        buttonTooltip: L_bobj_crv_TabList,
        changeCB: null,
        label: null,
        tabIndex: 0,
        multiSelect: false,
        menuWidth: null,
        menuTooltip: null 
    }, kwArgs);
    
    var o = newButtonWidget(
        kwArgs.id,
        kwArgs.label,
        bobj.crv.ButtonList._onClick, 
        kwArgs.buttonWidth,
        null,
        kwArgs.buttonTooltip,
        kwArgs.tabIndex,
        0, _skin+"menus.gif", 7, 16, 0, 81, true, 0, 97);
    
    o._menu = newListWidget(
        kwArgs.id + "_menu",
        MochiKit.Base.bind(bobj.crv.ButtonList._onChange, o),
        kwArgs.multiSelect,
        kwArgs.menuWidth,
        kwArgs.numLines || 2, 
        kwArgs.menuTooltip,
        null,  //dblClickCB
        null); //keyUpCB
        
    o._listItems = [];
    o._blOldInit = o.init;
    o._blOldGetHTML = o.getHTML;
    o._menuDiv = null;
    
    o._captureClicks = MenuWidget_captureClicks;
    o._releaseClicks = MenuWidget_releaseClicks;
    
    bobj.fillIn(o, kwArgs);  
    o.widgetType = 'ButtonList';
    MochiKit.Base.update(o, bobj.crv.ButtonList);
    
    return o;
};

/**
 * @return [Widget] Menu/list widget associated with this button.
 */
bobj.crv.ButtonList.getMenu = function() {
    return this._menu;   
};

/**
 * Add an item to the menu
 *
 * @param label [String]           The text to display in the menu
 * @param value [any - opt.]       The value associated with the new menu item
 * @param isSelected [bool - opt.] True if item should be selected after being added
 * @param id    [String - opt.]    DHTML id associated with menu item;  
 */
bobj.crv.ButtonList.add = function(label, value, isSelected, id) {
    if (this._menu && this._menu.layer) {
        this._menu.add(label, value, isSelected, id);
    }
    else {
        this._listItems.push({lbl:label, val:value, sel:isSelected, id:id});    
    }
};

bobj.crv.ButtonList.init = function() {
    var menu = this._menu;
    this._blOldInit();
    menu.init();
    
    this._menuDiv = getLayer(this.id + '_menuDiv');
    
    var listItems = this._listItems;
    for (var i = 0, len = listItems.length; i < len; ++i) {
        var it = listItems[i];
        menu.add(it.lbl, it.val, it.sel, it.id);
    }
    this._listItems = [];
};

bobj.crv.ButtonList.getHTML = function() {
    var h = bobj.html;
    
    var menuDivAtts = {
        id: this.id + '_menuDiv',
        onmousedown: 'event.cancelBubble=true',
        'class': 'menuFrame',
        style: {
            visibility: 'hidden',
            position: 'absolute',
            'z-index': 5000
        }
    };
    return  this._blOldGetHTML() + h.DIV(menuDivAtts, this._menu.getHTML());
};

/**
 * @return [bool] True if and only if the menu is visible
 */
bobj.crv.ButtonList.isMenuShowing = function() {
    return this._menuDiv && this._menuDiv.style.visibility != 'hidden';
};

/**
 * Hide the menu
 */
bobj.crv.ButtonList.hideMenu = function() {
    if (this._menuDiv) {
        this._menuDiv.style.visibility = 'hidden';
    }
};

/**
 * Position and show the menu
 */
bobj.crv.ButtonList.showMenu = function() {
    if (this._menuDiv) {
        this._captureClicks();

        var body = document.body;
        
        if (this._menuDiv.parentNode !== body) {
            body.appendChild(this._menuDiv);
        }
    
        var divStyle = this._menuDiv.style;
        divStyle.left = '-1000px';
        divStyle.top = '-1000px';
        divStyle.visibility = 'visible';
    
        var winDim = MochiKit.Style.getViewportDimensions();
        
        var w = this._menu.layer.offsetWidth;
        var h = this._menu.getHeight();
        
        // If numLines wasn't specified, use as much space as necessary
        // while remaining within the viewport
        if (!this.numLines) {
            h =  Math.min(this._menu.layer.scrollHeight + 10, winDim.h - 10);
            this._menu.resize(null, h);
        }
        
        // Place the menu below the button and aligned with the left edge
        var btnPos = getPosScrolled(this.layer);  
        var x = btnPos.x;
        var y = btnPos.y + this.getHeight();
        
        // Change coordinates so the whole menu is on the screen
        var xRight = x + w + 4; 
        var yBottom = y + h + 4;

        var xMax = winDim.w + body.scrollLeft - Math.max(0, (winDim.w - body.offsetWidth)); 
        if (xRight > xMax) { 
            x = Math.max(0, x - (xRight - xMax));
        }
        
        var yMax = winDim.h + body.scrollTop;
        if (yBottom > yMax) {
            y = Math.max(0, y - (yBottom - yMax));
        }
        
        divStyle.left = x + 'px';
        divStyle.top = y + 'px';
    }
};

/**
 * Private. Capture clicks in the current document so that the menu can be 
 * hidden automatically.
 */
bobj.crv.ButtonList._captureClicks = function() {
    var BIND = MochiKit.Base.bind;
    try {
        this.layer.onmousedown = BIND(this._onCaptureClick, this, true);
        this._oldMousedown = document.onmousedown;
        document.onmousedown = BIND(this._onCaptureClick, this, false);
    }
    catch(ex)
    {
        if (bobj.crv.config.isDebug) {
            throw ex;    
        }
    }
};

/**
 * Private. Stop capturing clicks.
 */
bobj.crv.ButtonList._releaseClicks = function() {
    if (this.layer.onmousedown) { // non-null if clicks are being captured
        this.layer.onmousedown = null;
        document.onmousedown = this._oldMousedown;
    }
};

/**
 * Private. Button click callback.
 */
bobj.crv.ButtonList._onClick = function() { 
    if (!this._cancelNextClick) {
        this.showMenu();
    }
    this._cancelNextClick = false;
};

/**
 * Private. Menu change callback.
 */
bobj.crv.ButtonList._onChange = function() { 
    this._releaseClicks();
    this.hideMenu();
    
    if (this.changeCB) {
        this.changeCB();    
    }
};

/**
 * Private. Called when a click is captured (after _captureClicks has been called)
 */
bobj.crv.ButtonList._onCaptureClick = function(cancelNext, e) {
    this._cancelNextClick = cancelNext;
    eventCancelBubble(e);
    this.hideMenu();
    this._releaseClicks();
};




