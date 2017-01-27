/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof(bobj.crv.ToolPanel) == 'undefined') {
    bobj.crv.ToolPanel = {};
}

if (typeof(bobj.crv.GroupTree) == 'undefined') {
    bobj.crv.GroupTree = {};
}

if (typeof(bobj.crv.GroupTreeNode) == 'undefined') {
    bobj.crv.GroupTreeNode = {};
}

bobj.crv.ToolPanelType = { //values must match server's expectations
    None: 'None',
    GroupTree : 'GroupTree',
    ParameterPanel: 'ParameterPanel'
};

/**
 * ToolPanel constructor
 *
 * @param kwArgs.id     [String]  DOM node id
 * @param kwArgs.width  [String]  Width
 * @param kwArgs.height [String]  Height
 */
bobj.crv.newToolPanel = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId() + "_toolPanel",
        width: '300px',
        height: '100%',
        initialViewType: bobj.crv.ToolPanelType.None
    }, kwArgs);
    

    var o = newWidget(kwArgs.id); 
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);   
    
    o.widgetType = 'ToolPanel';
    
    o._children = [];
    o._selectedChild = null;

    // Update instance with member functions
    o.initOld = o.init;
    o.resizeOld = o.resize;
    MochiKit.Base.update(o, bobj.crv.ToolPanel);
    
    return o;
};

/**
 * Adds a child widget as a view. If the child has an isSelected attribute
 * that evaluates as true, it will be the selected (active) view.
 *
 * This function must be called before getHTML() is called. 
 *
 * @param widget [Widget]  Child view widget
 */
bobj.crv.ToolPanel.addChild = function(widget) {
    if (!widget) {return;}
    
    var connect = MochiKit.Signal.connect;
    var partial = MochiKit.Base.partial;
    var signal = MochiKit.Signal.signal;
    var Type = bobj.crv.ToolPanelType;

    if (widget.widgetType == 'GroupTree') {
        this._groupTree = widget;  
        
        connect(this._groupTree, 'grpDrilldown', partial(signal, this, 'grpDrilldown'));
        connect(this._groupTree, 'grpNodeRetrieveChildren', partial(signal, this, 'grpNodeRetrieveChildren'));
        connect(this._groupTree, 'grpNodeCollapse', partial(signal, this, 'grpNodeCollapse'));
        connect(this._groupTree, 'grpNodeExpand', partial(signal, this, 'grpNodeExpand'));
        
        if (this.initialViewType == Type.GroupTree) {
            this._selectedChild = widget;
        }
    }
    else if (widget.widgetType == 'ParameterPanel') {
        this._paramPanel = widget;
        if (this.initialViewType == Type.ParameterPanel) {
            this._selectedChild = widget;
        }
    }
    
    this._children.push(widget);
};

bobj.crv.ToolPanel.setView = function(panelType) {
    if (this._selectedChild) { 
        bobj.getContainer(this._selectedChild).style.display = 'none';
    }

    var Type = bobj.crv.ToolPanelType;
    if (Type.GroupTree == panelType) { 
        this._selectedChild = this._groupTree;
    }
    else if (Type.ParameterPanel == panelType) { 
        this._selectedChild = this._paramPanel;
    }
    else {
        this._selectedChild = null;
    }
    
    var container = bobj.getContainer(this._selectedChild);
    if (container) {
        container.style.display = '';
    }
    
    this._doLayout();
};

bobj.crv.ToolPanel.getHTML = function() {
    var h = bobj.html;

    var content = '';
    var children = this._children;
    for (var i = 0, len = children.length; i < len; ++i) {
        var child = children[i];
        var display = child === this._selectedChild ? '' : 'none';
        content += h.DIV({style:{display:display}}, child.getHTML());
    }
    
    var isDisplayed = (bobj.crv.ToolPanelType.None !== this.initialViewType); 
    var layerAtt = {
        id: this.id,
        'class': 'palette',
        style: {
            position : 'absolute',
            margin: '0', 
            width: this.width, 
            height: this.height,
            overflow: 'hidden',
            display: isDisplayed ? '' : 'none'
        }
    };
    
    var html = h.DIV(layerAtt, content);
                
    return html + bobj.crv.getInitHTML(this.widx);
};  

bobj.crv.ToolPanel.init = function() {
    this.initOld();
    var children = this._children;
    for (var i = 0, len = children.length; i < len; ++i) {
        children[i].init();    
    }
    
};

bobj.crv.ToolPanel.update = function(update, updatePack) {
    if(update && update.cons == "bobj.crv.newToolPanel") {
        for(var childVar in update.children) {
            var child = update.children[childVar];
            if(child) {
                switch(child.cons) {
                    case "bobj.crv.newGroupTree":
                        if(this._groupTree && updatePack.updateGroupTree()) {
                            this._groupTree.update(child, updatePack); 
                        }
                        break;
                    case "bobj.crv.newParameterPanel":
                        break; // will update parameter panel
                
                }
            }
        }
    }
};

bobj.crv.ToolPanel._doLayout = function() {
    var innerWidth = this.layer.clientWidth;
    var contentHeight = this.layer.clientHeight;

    if (this._selectedChild) {
        this._selectedChild.setDisplay(true);
        this._selectedChild.resize(innerWidth, contentHeight); 
    }
};

bobj.crv.ToolPanel.resize = function(w, h) { 
    bobj.setOuterSize(this.layer, w, h);
    this._doLayout(); 
    MochiKit.Signal.signal(this, 'resize', this.layer.offsetWidth, this.layer.offsetHeight);
};

bobj.crv.ToolPanel.getParameterPanel = function() {
    return this._paramPanel;   
};

/*
================================================================================
GroupTree
================================================================================
*/

/**
 * GroupTree constructor. 
 *
 * @param kwArgs.id       [String]  DOM node id
 * @param kwArgs.icns     [String]  URL to magnifying glass icon
 * @param kwArgs.minIcon  [String]  URL to min.gif
 * @param kwArgs.plusIcon [String]  URL to plus.gif
 */
bobj.crv.newGroupTree = function(kwArgs) {
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
       },
       icns : bobj.crvUri('images/magnify.gif'),
       minIcon : bobj.crvUri('images/min.gif'),
       plusIcon : bobj.crvUri('images/plus.gif')
    }, kwArgs);

    var o = newTreeWidget( kwArgs.id + '_tree',
                            '100%',
                            '100%',
                            kwArgs.icns, null, null, null,
                            bobj.crv.GroupTree._expand,
                            bobj.crv.GroupTree._collapse,
                            null,
                            kwArgs.minIcon, kwArgs.plusIcon);
                            
    o._children = [];
    bobj.fillIn(o, kwArgs);
    o.widgetType = 'GroupTree';
    o.initOld = o.init;

    UPDATE(o, bobj.crv.GroupTree);

    return o;    
};

/**
 * Adds a child widget as a group tree node. 
 *
 * @param widget [Widget]  Child tree node widget
 */
bobj.crv.GroupTree.addChild = function(widget) {
    var CONNECT = MochiKit.Signal.connect;
    widget.expandPath = this._children.length + '';
    this._children.push(widget);
    
    widget._updateProperty(this.enableDrilldown, this.enableNavigation);
    this.add(widget);
    widget.delayedAddChild(this.enableDrilldown, this.enableNavigation);
    
    CONNECT(widget, 'grpDrilldown', MochiKit.Base.partial(MochiKit.Signal.signal, this, 'grpDrilldown'));
    CONNECT(widget, 'grpNodeRetrieveChildren', MochiKit.Base.partial(MochiKit.Signal.signal, this, 'grpNodeRetrieveChildren'));
};

bobj.crv.GroupTree.init = function() {
   this.initOld();
   
   bobj.setVisualStyle(this.layer,this.visualStyle);
   
   var children = this._children;
   for (var i = 0, len = children.length; i < len; i++) {
        children[i].init();
   }
};

bobj.crv.GroupTree.update = function(update, updatePack) {
    if(update && updatePack) {
       var updatePath = updatePack.groupTreePath();
       if(updatePath.length > 0) {
           var pathArray = updatePath.split('-');
           var updateNode = update;
           var treeNode = this;

           for(var i = 0,end = pathArray.length; i < end; i++) {
               if(updateNode && treeNode) {
                   updateNode = updateNode.children[0]; 
                   treeNode = treeNode._children[parseInt(pathArray[i])];
                 }
            }
               
            if(updateNode && treeNode && updateNode.args.groupPath == treeNode.groupPath) {
            	if(treeNode._children && treeNode._children.length == 0) { // Only add children if they were not previously added
                    this.updateNode(updateNode,treeNode);
                    treeNode.delayedAddChild(update.args.enableDrilldown, update.args.enableNavigation);
                }
                treeNode.expand();
            }
        }
    }
};


bobj.crv.GroupTree.updateNode = function(updateNode, treeNode) {

    if(updateNode && treeNode) {
        for(var nodeNum in updateNode.children) {
            var node = bobj.crv.createWidget(updateNode.children[nodeNum]);
            treeNode.addChild(node);
        }
    }
};

/**
 * Private. Callback function when a (complete) group tree node is collapsed.
 */
bobj.crv.GroupTree._collapse = function(expandPath) {
    MochiKit.Signal.signal(this, 'grpNodeCollapse', expandPath);
};

/**
 * Private. Callback function when a (complete) group tree node is expanded.
 */
bobj.crv.GroupTree._expand = function(expandPath) {
    MochiKit.Signal.signal(this, 'grpNodeExpand', expandPath);
};

bobj.crv.GroupTree.resize = function(width, height) {
    bobj.setOuterSize(this.layer,width,height);
};

/**
 * GroupTreeNode constructor. 
 *
 * @param kwArgs.id     [String]  DOM node id
 * @param kwArgs.groupName  [String]  Name of the group
 * @param kwArgs.groupPath  [String]  Path of the group
 */
bobj.crv.newGroupTreeNode = function(kwArgs) { 
    var UPDATE = MochiKit.Base.update;
    kwArgs = UPDATE({id: bobj.uniqueId()}, kwArgs);
    var iconAlt = null;
    var iconId = -1; // by default, no icon
    if (!kwArgs.isVisible) {
        iconId = 0;
        iconAlt = L_bobj_crv_Tree_Drilldown_Node.replace('%1', kwArgs.groupName);
    }
    
    var o = newTreeWidgetElem(iconId, kwArgs.groupName, kwArgs.groupPath, null, null, null, iconAlt);
    
    o._children = [];
    bobj.fillIn(o, kwArgs);
    
    o.widgetType = 'GroupTreeNode';
    o.initOld = o.init;
    o.selectOld = o.select;
    o.select = bobj.crv.GroupTreeNode._drilldown;

    UPDATE(o, bobj.crv.GroupTreeNode);    

    return o;
};

bobj.crv.GroupTreeNode.init = function() {
    this.initOld();
    this._setVisualStyle();
    
    if (this.isStatic) {
        //"treeNormal" is the default css class for tree node text
        var spans = MochiKit.DOM.getElementsByTagAndClassName("span", "treeNormal", this.layer);
        if (spans && spans.length > 0) {
            spans[0].style.cursor = 'text';
        }
    }
};


bobj.crv.GroupTreeNode.expand = function() {
    var elemId = TreeIdToIdx(this.layer);
    _TreeWidgetElemInstances[elemId].expanded = false
    TreeWidget_toggleCB(elemId);
};

bobj.crv.GroupTreeNode.collapse = function() {
    var elemId = TreeIdToIdx(this.layer);
    _TreeWidgetElemInstances[elemId].expanded = true
    TreeWidget_toggleCB(elemId);
};

bobj.crv.GroupTreeNode._setVisualStyle = function () {
   
    try{
        var textNode = this.layer.lastChild;
        var parentNode = this.treeView;
    }
    catch(err){
        return;
    }
    
    var pvStyle = parentNode.visualStyle;
    var tStyle = textNode.style;
    
   if(pvStyle.fontFamily) {
        tStyle.fontFamily = pvStyle.fontFamily;
   }
   
   if(pvStyle.fontWeight) {
        tStyle.fontWeight = pvStyle.fontWeight;
   }
   
   if(pvStyle.textDecoration) {
        tStyle.textDecoration = pvStyle.textDecoration;
   }
   
   if(pvStyle.color) {
       tStyle.color = pvStyle.color;
   }
   
   
   if(pvStyle.fontStyle) {
        tStyle.fontStyle = pvStyle.fontStyle;
   }
   
   if(pvStyle.fontSize) {
        tStyle.fontSize = pvStyle.fontSize;
   }
};
/**
 * Delay add the child nodes to a node recursively. 
 * The addition of nodes has to happen in a top-down fashion because each node has a reference to the tree 
 * and this reference is retrieved from the parent node.
 */
bobj.crv.GroupTreeNode.delayedAddChild = function(enableDrilldown, enableNavigation) {
    var CONNECT = MochiKit.Signal.connect;
    var SIGNAL = MochiKit.Signal.signal;
    var PARTIAL = MochiKit.Base.partial;
    var childCount = this._children.length;
    
    if (childCount > 0) {
        this.expanded = true;
    }
    else {
        this.expanded = false;
        
        if (!this.leaf)    {
            this.setIncomplete(bobj.crv.GroupTreeNode._getChildren);
        }
    }
    
    var children = this._children;
    for (var i = 0; i < childCount; i++) {
        var childNode = children[i];
        childNode.expandPath = this.expandPath + '-' + i;
        childNode._updateProperty(enableDrilldown, enableNavigation);
        this.add(childNode);
        CONNECT(childNode, 'grpDrilldown', PARTIAL(SIGNAL, this, 'grpDrilldown'));
        CONNECT(childNode, 'grpNodeRetrieveChildren', PARTIAL(SIGNAL, this, 'grpNodeRetrieveChildren'));
        
        childNode.delayedAddChild(enableDrilldown, enableNavigation);
    }
};

bobj.crv.GroupTreeNode.addChild = function(widget) {
    this._children.push(widget);
};

/**
 * Private. Callback function when a group tree node is clicked, which is a group drilldown.
 */
bobj.crv.GroupTreeNode._drilldown = function() {
    this.selectOld();
    MochiKit.Signal.signal(this, 'grpDrilldown', this.groupName, this.groupPath, this.isVisible);
};

/**
 * Private. Callback function when an incomplete group tree node is expanded.
 */
bobj.crv.GroupTreeNode._getChildren = function() {
    this.plusLyr.src = _skin + '../loading.gif';
    MochiKit.Signal.signal(this, 'grpNodeRetrieveChildren', this.expandPath);
};

/**
 * Private. Change the select event handler and text style class based on the two given flags.
 */
bobj.crv.GroupTreeNode._updateProperty = function (enableDrilldown, enableNavigation) {
    var isStatic = false;
    if (this.isVisible && !enableNavigation) {
        isStatic = true;
    }
    else if (!this.isVisible && !enableDrilldown) {
        isStatic = true;
    }
    
    if (isStatic) {
        this.select = function() {};
    }
    
    this.isStatic = isStatic;
};
