/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof(bobj.crv.StackedPanel) == 'undefined') {
    bobj.crv.StackedPanel = {};
}

if (typeof(bobj.crv.StackedTab) == 'undefined') {
    bobj.crv.StackedTab = {};
}

/**
 * Constructor. 
 *
 * @param id      [String]  DHTML id
 * @param width   [int]     Width of the panel in pixels
 * @param height  [int]     Height of the panel in pixels
 */
bobj.crv.newStackedPanel = function(kwArgs) {
    var mb = MochiKit.Base;
    var UPDATE = mb.update;
    var BIND = mb.bind;
    
    kwArgs = UPDATE({
        id: bobj.uniqueId(),
        width: null,
        height: null,
        isAnimated: true
    }, kwArgs);
    
    var o = newWidget(kwArgs.id);
    o.widgetType = 'StackedPanel';
    bobj.fillIn(o, kwArgs);  
    
    o._tabs = [];
    
    o._initWidget = o.init;
    o._resizeWidget = o.resize;
    UPDATE(o, bobj.crv.StackedPanel);
    
    o._onTabCollapse = BIND(o._onTabCollapse, o);
    o._onTabExpand = BIND(o._onTabExpand, o);
    
    return o;    
};

bobj.crv.StackedPanel.init = function() {
    this._initWidget();
    
    var tabs = this._tabs;
    // Tabs that were added after getHTML must be written now
    var index = this._numTabsWritten;
    while (index < tabs.length) {
        append(this.layer, tabs[index].getHTML(), document);
        index++;
    }
    
    for (var i = 0, len = tabs.length; i < len; ++i) {
        tabs[i].init();
    }
    
};

bobj.crv.StackedPanel.getHTML = function() {
    var DIV = bobj.html.DIV;
    
    var layerStyle = {
        overflow: 'auto',
        position: 'relative'
    };
     
    if (this.height) {
        layerStyle.height = bobj.unitValue(this.height);
    }
    
    if (this.width) {
        layerStyle.width =  bobj.unitValue(this.width);
    }
    
    return DIV({id: this.id, style: layerStyle, tabIndex: "-1"}, this._getTabsHTML());
};

bobj.crv.StackedPanel._getTabsHTML = function() {
    var tabsHTML = '';
    var tabs = this._tabs;
    var tabsLen = tabs.length;
    for (var i = 0; i < tabsLen; ++i) {
        tabsHTML += tabs[i].getHTML();
    }
    this._numTabsWritten = tabsLen;
    return tabsHTML;
};

/**
 * Add a tab to the panel. Must be called before getHTML is called.
 *
 * @param tab [StackedTab] 
 */
bobj.crv.StackedPanel.addTab = function(tab) {
    if (tab) {
        tab.collapseCB = this._onTabCollapse; 
        tab.expandCB = this._onTabExpand;
        
        this._tabs.push(tab);
        
        if (this.layer) {
            append(this.layer, tab.getHTML());
            tab.init();
        }
    }
};

bobj.crv.StackedPanel.getNumTabs = function() {
        return this._tabs.length;    
};

bobj.crv.StackedPanel.getTab = function(index) {
    return this._tabs[index];
};

bobj.crv.StackedPanel.removeTab = function(index) {
    if (index >= 0 && index < this._tabs.length) { 
        var tab = this._tabs[index];
        this._tabs.splice(index, 1);
        delete _widgets[this._tabs.widx];
        if (tab.layer) {
            tab.layer.parentNode.removeChild(tab.layer);
        }
    }
};

bobj.crv.StackedPanel.resize = function(w, h) {
    // Exclude margins for safari as it miscalculates left/top margins
    var excludeMargins = !_saf; 
    bobj.setOuterSize(this.layer, w, h, excludeMargins);
    var tabs = this._tabs;
    var tabsLen = tabs.length;
    if (tabsLen) {
        // Ensure that the vertical scrollbar never covers the content
        var tabWidth = this.layer.clientWidth; 
        
        // IE changes the value of clientWidth after resizing the first child...
        tabs[0].resize(tabWidth);
        if (tabWidth != this.layer.clientWidth) {
            tabWidth = this.layer.clientWidth; 
            tabs[0].resize(tabWidth);
        }
        
        for (var i = 1; i < tabsLen; ++i) {
            tabs[i].resize(tabWidth);    
        }
    }
};

bobj.crv.StackedPanel._onTabCollapse = function(tab) { 
    this.resize();    
};

bobj.crv.StackedPanel._onTabExpand = function(tab) { 
    this.resize();    
};

/*
================================================================================
StackedTab
================================================================================
*/
bobj.crv.newStackedTab = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
   
    kwArgs = UPDATE({
        id: bobj.uniqueId(),
        label: '',
        width: 300,
        height: null,  // null height means grow as big as necessary
        isAnimated: true,
        expandCB: null,
        openAdvCB: null,
        selectCB: null,
        collapseCB: null,
        expandImgPos: "right"
    }, kwArgs);
    
    var o = newWidget(kwArgs.id);
    o.widgetType = 'StackedTab';
    bobj.fillIn(o, kwArgs);  
    
    o._content = null;
    o._leftIcons = [];
    o._rightIcons = [];
    
    o._IMG_WIDTH = 16;
    o._IMG_HEIGHT = 16;
    o._ICON_WIDTH = 20;
    
    o._initWidget = o.init;
    o._resizeWidget = o.resize;
    UPDATE(o, bobj.crv.StackedTab);
    
    return o;    
};

bobj.crv.StackedTab.init = function() {
    var CONNECT = MochiKit.Signal.connect;
    this._initWidget();
    
    if (this._content) {
        this._content.init();    
    }
    
    this._labelCtn = document.getElementById(this.id + '_labelCtn');
    this._textCtn =  document.getElementById(this.id + '_textCtn');
    this._expandCtn = document.getElementById(this.id + '_expandCtn');
    this._expandImg = document.getElementById(this.id + '_expand');
    this._contentCtn = document.getElementById(this.id + '_contentCtn');
    
    if(this.openAdvCB) {
        CONNECT(this._labelCtn, 'ondblclick',this.openAdvCB);
    }
    if(this.selectCB) {
        CONNECT(this._labelCtn, 'onclick',this.selectCB);
    }
    
    this.setMinMaxIconToolTip();
};

bobj.crv.StackedTab.getHTML = function() {
    var DIV = bobj.html.DIV;
    
    var ctnStyle = {
        width: this.width + 'px',
        overflow: 'hidden'
    };
    
    
    var labelCtnAtt = {
        id: this.id + '_labelCtn',
        'class': 'stackedTabLabel crvnoselect thumbtxt '
    };
    
    var expandCtnAtt = {
        id: this.id + '_expandCtn',
        onclick: "bobj.crv.StackedTab._onExpandClick('" + this.id + "')",
        'class': 'stackedTabIconCtn', 
        style: {cursor : 'pointer'}
    };
    
    if (this.expandImgPos === "left") {
        expandCtnAtt.style.left = "0px";
    }
    else {
        expandCtnAtt.style.right = "-1px";
    }
    
    var contentHTML = this._content ? this._content.getHTML() : '';
    
    var imgW = this._IMG_WIDTH;
    var imgH = this._IMG_HEIGHT;
    
    var html = DIV({id: this.id, style: ctnStyle},
        DIV(labelCtnAtt,
            DIV(expandCtnAtt, 
                imgOffset(bobj.crvUri('images/param_panel.gif'), imgW, imgH, imgW, 16, this.id + '_expand')),
            DIV({'class': 'stackedTabText', style: this._getTextCtnStyle(), id: this.id + '_textCtn'}, this.label),
                this._getIconsHtml(this._leftIcons, true) + this._getIconsHtml(this._rightIcons, false)),
        DIV({id: this.id + '_contentCtn'}, contentHTML));
        
    return html;
};

/*
 * Sets the icon's tooltip using bobj.crv.tooltip after elements are added to document
 */
bobj.crv.StackedTab.setMinMaxIconToolTip = function() {
    var rightIcons = this._rightIcons;
    for(var i = 0, len = rightIcons.length; i < len; i++) {
        var iconID = rightIcons[i].id;
        var icontooltip = rightIcons[i].tooltip;
        
        if(iconID.indexOf('_icnInfo') >= 0) {
            var icon = getLayer(iconID);
            this._setIconTooltip(icon, icontooltip);
        }
    }
};

bobj.crv.StackedTab._setIconTooltip = function(icon,tooltip) {
    if(icon !== null && tooltip !== null) {
        bobj.crv.Tooltip.setElementTooltip(icon,tooltip);
    }

};

/**
 * Get html for any icons that have been added
 *
 * @param icons [Array] List of icon objects
 * @param isLeftAligned [Boolean] when true, icon is placed on the left side 
 *
 * @return [String] Returns an html fragment
 */
bobj.crv.StackedTab._getIconsHtml = function(icons, isLeftAligned) { 
    var DIV = bobj.html.DIV;
    var iconsHtml = '';
    
    for (var i = 0, len = icons.length; i < len; ++i) {
        var icon = icons[i];
        var isInfoIcon = (icon.id.indexOf('_icnInfo') >= 0) ? true : false;
        iconsHtml += DIV({id: icon.id, 'class': 'stackedTabIconCtn', style: this._getIconCtnStyle(icon, isLeftAligned, i)}, 
            imgOffset(icon.url, this._IMG_WIDTH, this._IMG_HEIGHT, icon.dx, icon.dy, null, null, (isInfoIcon? null : icon.tooltip)));    
    }
    
    return iconsHtml;
};

/**
 * Count the number of icons in a list that are visible
 *
 * @param list [Array] List of icon info objects
 *
 * @return [int] Returns the number of visible icons
 */
bobj.crv.StackedTab._countVisibleIcons = function(list) {
    var filteredList = MochiKit.Base.filter(function(icon) {
        return icon.isVisible;    
    }, list);
    return filteredList.length;
};

/**
 * Get the style properties of the div that contains an icon. 
 *
 * @param icon [Object]  Icon info object
 * @param isLeftAligned [bool] When true, icon is positioned on the left side
 * @param index [int] Index of icon in the list of left or right icons
 *
 * @return [Object] Returns style properties that position the icon and set its 
 *                  visibility
 */
bobj.crv.StackedTab._getIconCtnStyle = function(icon, isLeftAligned, index) {
    var list = isLeftAligned ? this._leftIcons : this._rightIcons;
    var xPos = this._countVisibleIcons(bobj.slice(list, 0, index)) * this._ICON_WIDTH -1;
   
    var style = {
        display: icon.isVisible ? 'block' : 'none'
    };
    
    if (isLeftAligned) { 
        if (this.expandImgPos === 'left') {
            xPos += this._ICON_WIDTH;    
        }
        style.left = xPos + 'px'; 
    }
    else { 
        if (this.expandImgPos === 'right') {
            xPos += this._ICON_WIDTH;    
        }
        style.right = xPos + 'px';    
    }
    
    return style;
};

/**
 * Get the style of the div that contains the label text
 *
 * @param useCamelCase [bool] When true, camelCase style names are used. When 
 *                            false, hyphenated style names are used.
 *
 * @return [Object] Returns style properties that position the text
 */
bobj.crv.StackedTab._getTextCtnStyle = function(useCamelCase) {
    var lMarg = 0;
    var rMarg = 0;
    var iconW = this._ICON_WIDTH;
    
    if (this.expandImgPos === 'left') {
        lMarg += iconW;    
    }
    else {
        rMarg += iconW;    
    }
    
    lMarg += this._countVisibleIcons(this._leftIcons) * iconW; 
    rMarg += this._countVisibleIcons(this._rightIcons) * iconW;
    
    lMarg = Math.max(lMarg, 2);
    rMarg = Math.max(rMarg, 2);
    
    var textStyle = {};
    if (useCamelCase) {
        textStyle.marginLeft = lMarg + 'px';
        textStyle.marginRight = rMarg + 'px';
    }
    else {
        textStyle['margin-left'] = lMarg + 'px';
        textStyle['margin-right'] = rMarg + 'px';
    }
    
    if (MochiKit.Base.isIE() && bobj.isQuirksMode()) {    
        textStyle.width = '100%';
    }
    
    return textStyle;
};

/**
 * Add an icon to the label
 *
 * @param url  [String] Url of the icon image (16x16 pixels)
 * @param dx [int] the horizontal offset in combined image
 * @param dy [int] the vertical offset in combined image
 * @param tooltip  [String - optional] Icon tooltip
 * @param isLeftAligned  [bool - optional] When true, place on left. When false, place on right.
 * @param isVisible  [bool - optional] Initial visibility of the icon
 * @param id  [String - optional] ID of the icon (valid dhtml ID)
 *
 * @return [String] Returns an ID for the icon that can be used to reference it 
 *                  later, when showing or hiding it, for example.
 */
bobj.crv.StackedTab.addIcon = function(url, dx, dy, tooltip, isLeftAligned, isVisible, id) {
    id = id || bobj.uniqueId();
    var iconInfo = {
        url: url,
        dx:dx,
        dy:dy,
        tooltip: tooltip,
        isVisible: isVisible,
        id: id
    };
    
    if (isLeftAligned) {
        this._leftIcons.push(iconInfo);
    }
    else { 
        this._rightIcons.push(iconInfo);    
    }
    
    return id;
};

/**
 * Find an icon info object using its ID
 *
 * @param id [String] ID of theicon to find
 *
 * @return [Object] Returns icon information or null
 */
bobj.crv.StackedTab._findIcon = function(id) {
    var list = this._leftIcons;
    do {
        for (var i = 0, len = list.length; i < len; ++i) {
            var icon = list[i];    
            if (icon.id == id) {
                return icon;    
            }
        }
        list = (list === this._leftIcons) ? this._rightIcons : null;
    } while(list);
    return null;
};

/**
 * Make an icon visible
 *
 * @param id [String] ID of the icon to make visible
 */
bobj.crv.StackedTab.showIcon = function(id) {
    var icon = this._findIcon(id);
    if (icon) {
        icon.isVisible = true;
        var dom = document.getElementById(id);
        if (dom) {
            var needPaint = dom.style.display != 'block';
            dom.style.display = 'block';
            if (needPaint) {
                this._paintLabel();
            }
        }
    }
};

/**
 * Check whether an icon is visible
 * 
 * @param id [string] ID of the icon
 *
 * @return [bool] returns true if icon is visible
 */
bobj.crv.StackedTab.isIconShowing = function(id) {
    var icon = this._findIcon(id);
    if (icon) {
        return icon.isVisible;    
    }
    return false;
};

/**
 * Hide an icon
 * 
 * @param id [String] ID of the icon to make visible
 */
bobj.crv.StackedTab.hideIcon = function(id) {
    var icon = this._findIcon(id);
    if (icon) {
        icon.isVisible = false;
        var dom = document.getElementById(id);
        if (dom) {
            var needPaint = dom.style.display != 'none';
            dom.style.display = 'none';
            if (needPaint) {
                this._paintLabel();
            }
        }
    }
};

/**
 * Set an icon's tooltip
 *
 * @param id [String]      ID of the icon 
 * @param tooltip [String] Tooltip to display
 */
bobj.crv.StackedTab.setIconTooltip = function(id, tooltip) {
    var icon = this._findIcon(id);
    if (icon) {
        icon.tooltip = tooltip;
        var dom = document.getElementById(id);
        if (dom) {
            dom.title = tooltip;
        }
    }
};

/**
 * Reposition text and icons in the label
 */
bobj.crv.StackedTab._paintLabel = function() {
    var list = this._leftIcons;
    do {
        for (var i = 0, len = list.length; i < len; ++i) {
            var icon = list[i];
            var dom = document.getElementById(icon.id);
            if (dom) {
                MochiKit.Base.update(dom.style, this._getIconCtnStyle(icon, list === this._leftIcons, i));
            }
        }
        list = (list === this._leftIcons) ? this._rightIcons : null;
    } while(list);
    
    MochiKit.Base.update(this._textCtn.style, this._getTextCtnStyle(true)); 
};

bobj.crv.StackedTab.resize = function(w) {
    if(this._labelCtn) {
        // Exclude margins for safari as it miscalculates left/top margins
        var excludeMargins = !_saf; 
        bobj.setOuterSize(this._labelCtn, w, excludeMargins);   
    }
    if (this._content) { 
        this._content.resize(w);
    }    
    bobj.setOuterSize(this.layer, w);

};

/**
 * Set the widget that is displayed below the tab. Must be called before getHTML.
 *
 * @param widget [Widget]  Widget that appears below the tab when the tab is expanded
 */
bobj.crv.StackedTab.setContent = function(widget) {
    this._content = widget;   
};

/**
 * Get the widget that is displayed below the tab.
 *
 * @return [Widget]  Widget that appears below the tab
 */
bobj.crv.StackedTab.getContent = function() {
    return this._content;   
};

/**
 * Show the tab's content below the tab label
 */
bobj.crv.StackedTab.expand = function() {
    if (!this.isExpanded()) {
        changeOffset(this._expandImg, 16, 16);
        
        var cb = MochiKit.Base.partial(this.expandCB || MochiKit.Base.noop, this);
        
        if (this.isAnimated) {
            var options = {duration: 0.2, afterFinish: cb};
            if(MochiKit.Base.isIE()) {
                options.restoreAfterFinish = false;
                options.scaleContent = true;
            }
         
            MochiKit.Visual.blindDown(this._contentCtn, options);
            this.resize();
        }
        else {
            this._contentCtn.style.display = ''; 
            this.resize();
            cb();
        }
    }
};

/**
 * @return True if and only if the tab's content is displayed
 */
bobj.crv.StackedTab.isExpanded = function() {
    return this._contentCtn.style.display != 'none';
};

/**
 * Hide the tab's content
 */
bobj.crv.StackedTab.collapse = function() {
    changeOffset(this._expandImg, 0, 16);

    var cb = MochiKit.Base.partial(this.collapseCB || MochiKit.Base.noop, this);
    
    if (this.isAnimated) {
        MochiKit.Visual.blindUp(this._contentCtn, {duration: 0.2, afterFinish: cb, scaleContent: true});
    }
    else {
        this._contentCtn.style.display = 'none';  
        cb();
    }
};

/**
 * Private. Handles click events on the tab's label.
 */
bobj.crv.StackedTab._onExpandClick = function(id) {
    var o = getWidgetFromID(id);
    
    if (o.isExpanded()) { 
        o.collapse();
    }
    else {
        o.expand();    
    }
};

/**
 * Private. Handles mouseover events on the tab's label.
 */
bobj.crv.StackedTab._onMouseOver = function(id) {
    var o = getWidgetFromID(id);
    MochiKit.DOM.addElementClass(o._labelCtn, 'stackedTabLabelHover');
};

/**
 * Private. Handles mouseout events on the tab's label.
 */
bobj.crv.StackedTab._onMouseOut = function(id) {
    var o = getWidgetFromID(id);
    MochiKit.DOM.removeElementClass(o._labelCtn, 'stackedTabLabelHover');
};

/**
 * Override the MochiKit Scale effect's setDimensions method to work around an 
 * IE bug. The Scale effect is used by the blindUp effect, which is used to 
 * animate tab collapse. When the element dimension is set to 0, IE displays it
 * with its natural height, causing serious flicker at the end of the animation. 
 */ 
if (!MochiKit.Visual.Scale.prototype._crvSetDimensions) {
    MochiKit.Visual.Scale.prototype._crvSetDimensions = MochiKit.Visual.Scale.prototype.setDimensions;
    MochiKit.Visual.Scale.prototype.setDimensions = function(height, width) {
        height = Math.round(height) || 1;
        width = Math.round(width) || 1;
        MochiKit.Visual.Scale.prototype._crvSetDimensions.call(this, height, width);
    };
}
