/* Copyright (c) Business Objects 2006. All rights reserved. */

/**
 * ViewerListener Constructor. Handles Viewer UI events.
 */
 
if(typeof(bobj.crv.Async) == 'undefined') {
    bobj.crv.Async = {};
}

/*
 * UpdatePack Constructor. Stores what needs to be updated after a response is received
 * from server.
 */
bobj.crv.Async.UpdatePack = function() { 

    this.viewer = {
                refreshLayout: false,
                requiresScrolling: false,
                toolbar : { requiresUpdate: false },
                reportAlbum: {
                    updateTabs: false,
                    reportView : {
                        reportPage : {requiresUpdate: false },
                        toolPanel  : {
                            groupTree  : {requiresUpdate: false, path: ''},
                            paramPanel : {requiresUpdate: false}
                        }
                    }
                 }
    };       
};

bobj.crv.Async.UpdatePack.prototype = {
    /**
     * Public. Sets whether grouptree needs to be updated
     */
    setUpdateGroupTree: function(doUpdate) {
        this.viewer.reportAlbum.reportView.toolPanel.groupTree.requiresUpdate = doUpdate;
    },

    /**
     * Public. Sets whether scrolling is required after response is received
     */    
    setRequiresScrolling: function(scroll) {
        this.viewer.requiresScrolling = scroll;
    },
    
    requiresScrolling: function() {
        return this.viewer.requiresScrolling;
    },

    /**
     * Public. Sets the grouptree path that will be updated after response is received
     */       
    setGroupTreePath : function(path) {
        this.viewer.reportAlbum.reportView.toolPanel.groupTree.path = path;
    },
    
    updateGroupTree : function() {
        return this.viewer.reportAlbum.reportView.toolPanel.groupTree.requiresUpdate;
    },
    
    groupTreePath : function() {
        return this.viewer.reportAlbum.reportView.toolPanel.groupTree.path;
    },
    
    /**
     * Public. Sets whether reportpage needs to be updated
     */       
    setUpdateReportPage: function(doUpdate) {
        this.viewer.reportAlbum.reportView.reportPage.requiresUpdate = doUpdate;
    },
    
    updateReportPage : function() {
        return this.viewer.reportAlbum.reportView.reportPage.requiresUpdate;
    },
 
     /**
     * Public. Sets whether parameterpanel needs to be updated
     */    
    setUpdateParamPanel : function(doUpdate) {
        return this.viewer.reportAlbum.reportView.toolPanel.paramPanel.requiresUpdate;
    },
    
    updateParamPanel: function() {
        return this.viewer.reportAlbum.reportView.toolPanel.paramPanel.requiresUpdate;
    },
    
    updateToolPanel : function() {
        return this.updateGroupTree() ||  this.updateParamPanel();
    },
    
    updateReportAlbum: function() {
        return this.updateReportView() || this.viewer.reportAlbum.updateTabs;
    },
    
    updateReportView: function() {
        return this.updateToolPanel() || this.updateReportPage();
    },

    /**
     * Public. Sets whether toolbar needs to be updated
     */     
    setUpdateToolbar : function(doUpdate) {
        this.viewer.toolbar.requiresUpdate = doUpdate;
    },
    
    updateToolbar : function() {
        return this.viewer.toolbar.requiresUpdate;
    },
 
     /**
     * Public. Sets whether report album tabs needs to be updated
     */    
    setUpdateTabs: function(doUpdate) {
        this.viewer.reportAlbum.updateTabs = doUpdate;
    },
    
    updateTabs : function() {
        return this.viewer.reportAlbum.updateTabs;
    },
    
    /**
     * Public. Sets whether viewer needs to update its size
     */     
    refreshLayout: function() {
        return this.viewer.refreshLayout;
    },
    
    setRefreshLayout: function(refresh) {
        this.viewer.refreshLayout= refresh;
    }    
}


bobj.crv.ViewerListener = function(viewerName, ioHandler) {
    this._name = viewerName;
    this._viewer = null;
    this._promptPage = null; 
    this._paramCtrl = null;
    this._ioHandler = ioHandler;
    this._reportProcessing = null;
    
    var connect = MochiKit.Signal.connect;
    var subscribe = bobj.event.subscribe;
    var bind = MochiKit.Base.bind;
    
    var widget = getWidgetFromID(viewerName);
    if (widget) {
        if (widget.widgetType == 'Viewer') {
            this._viewer = widget;
            this._reportProcessing = this._viewer._reportProcessing;
        }
        else if (widget.widgetType == 'PromptPage') {
            this._promptPage = widget;    
            this._reportProcessing = this._promptPage._reportProcessing;
        }
    }
    
    if (this._viewer) {
        // ReportAlbum events
        connect(this._viewer, 'selectView', this, '_onSelectView');
        connect(this._viewer, 'removeView', this, '_onRemoveView');
        
        // Toolbar events
        connect(this._viewer, 'firstPage', this, '_onFirstPage');
        connect(this._viewer, 'prevPage', this, '_onPrevPage');
        connect(this._viewer, 'nextPage', this, '_onNextPage');
        connect(this._viewer, 'lastPage', this, '_onLastPage');
        connect(this._viewer, 'selectPage', this, '_onSelectPage');
        connect(this._viewer, 'zoom', this, '_onZoom');
        connect(this._viewer, 'drillUp', this, '_onDrillUp');
        connect(this._viewer, 'refresh', this, '_onRefresh');  
        connect(this._viewer, 'search', this, '_onSearch');
        connect(this._viewer, 'export', this, '_onExport');
        connect(this._viewer, 'print', this, '_onPrint');
        
        // Tool Panel events
        connect(this._viewer, 'resizeToolPanel', this, '_onResizeToolPanel');
        connect(this._viewer, 'hideToolPanel', this, '_onHideToolPanel');
        connect(this._viewer, 'grpDrilldown', this, '_onDrilldownGroupTree');
        connect(this._viewer, 'grpNodeRetrieveChildren', this, '_onRetrieveGroupTreeNodeChildren');
        connect(this._viewer, 'grpNodeCollapse', this, '_onCollapseGroupTreeNode');
        connect(this._viewer, 'grpNodeExpand', this, '_onExpandGroupTreeNode');
        connect(this._viewer, 'showParamPanel', this, '_onShowParamPanel');
        connect(this._viewer, 'showGroupTree', this, '_onShowGroupTree');
        
        connect(this._viewer, 'printSubmitted', this, '_onSubmitExport');
        connect(this._viewer, 'exportSubmitted', this, '_onSubmitExport');
        
        this._setInteractiveParams();
    }
    
    // Report Page Events
    subscribe('drilldown', this._forwardTo('_onDrilldown')); 
    subscribe('drilldownGraph', this._forwardTo('_onDrilldownGraph'));
    subscribe('drilldownSubreport', this._forwardTo('_onDrilldownSubreport'));
    subscribe('sort', this._forwardTo('_onSort'));
    subscribe('hyperlinkClicked', this._forwardTo('_onHyperlinkClicked'));
    
    // Prompt events
    subscribe('crprompt_param', this._forwardTo('_onSubmitStaticPrompts'));
    subscribe('crprompt_pmtEngine', this._forwardTo('_onSubmitPromptEnginePrompts'));
    subscribe('crprompt_logon', this._forwardTo('_onSubmitDBLogon'));
    subscribe('crprompt_cancel',this._forwardTo('_onCancelParamDlg'));
    subscribe('crprompt_flexparam', this._forwardTo('_onFlexParam'));
    subscribe('crprompt_flexlogon', this._forwardTo('_onFlexLogon'));
    
    // Report Part Events
    subscribe('pnav', this._forwardTo('_onNavigateReportPart'));
    subscribe ('navbookmark', this._forwardTo('_onNavigateBookmark'));
    
    // Universal Events, No Target Checks
    subscribe('saveViewState', bind(this._onSaveViewState, this)); 
};

bobj.crv.ViewerListener.prototype = {

    /**
     * Public
     *
     * @return The current report view 
     */
     getCurrentView: function() {
         if(this._viewer && this._viewer._reportAlbum) {
             return this._viewer._reportAlbum.getSelectedView();
         }
         
         return null;
     },
     
    /**
     * Private. Wraps an event handler function with an event target check.
     *
     * @param handlerName [String]  Name of the event handler method
     *
     * @return Function that can be used as a callback for subscriptions
     */
    _forwardTo: function(handlerName) {
        return MochiKit.Base.bind(function(target) {
            if (target == this._name) {
                var args = bobj.slice(arguments, 1);
                this[handlerName].apply(this, args);
            }
        }, this);    
    },

    _onSaveViewState: function() {
        this._saveViewState();
    },

    _onSelectView: function(view) {
        if (view) {
            bobj.crv.logger.info('UIAction View.Select');
            if (view.hasContent()) {
                this._updateUIState();
            }
            else {
                // Since "restore state" happens before events, we need to 
                // change the curViewId before making the server request
                var state = bobj.crv.stateManager.getComponentState(this._name);
                if (state) {
                    state.curViewId = view.viewStateId;
                    this._request({selectView: view.viewStateId}, false);
                }
            }
        }
    },
    
    _onRemoveView: function(view) {
        if (view) {
            bobj.crv.logger.info('UIAction View.Remove');
            var viewerState = bobj.crv.stateManager.getComponentState(this._name);
            if (viewerState) {
                // Remove view from viewer state
                delete viewerState[view.viewStateId];
            }
            
            var commonState = this._getCommonState();
            if (commonState) {
                // Remove view from taborder
                var idx = MochiKit.Base.findValue(commonState.rptAlbumOrder, view.viewStateId);
                if (idx != -1) {
                    arrayRemove(commonState, 'rptAlbumOrder', idx);   
                }
            }
        }
    },
    
    _getPageNavigationUpdatePack : function() {
        var updatePack = new bobj.crv.Async.UpdatePack();
        updatePack.setUpdateReportPage(true);
        updatePack.setUpdateToolbar(true);   
        updatePack.setRefreshLayout(true);

        return updatePack; 
    },
    
    _onFirstPage: function() {
        bobj.crv.logger.info('UIAction Toolbar.FirstPage');
        this._request({tb:'first'}, bobj.crv.config.useAsync,true, this._getPageNavigationUpdatePack());
        
    },
    
    _onPrevPage: function() {
        bobj.crv.logger.info('UIAction Toolbar.PrevPage');
        this._request({tb:'prev'}, bobj.crv.config.useAsync,true, this._getPageNavigationUpdatePack());
    },
    
    _onNextPage: function() {
        bobj.crv.logger.info('UIAction Toolbar.NextPage');
        this._request({tb:'next'}, bobj.crv.config.useAsync, true, this._getPageNavigationUpdatePack());
    },
    
    _onLastPage: function() {
        bobj.crv.logger.info('UIAction Toolbar.LastPage');
        this._request({tb:'last'}, bobj.crv.config.useAsync,true, this._getPageNavigationUpdatePack());
    },

    _onDrillUp: function() {
        bobj.crv.logger.info('UIAction Toolbar.DrillUp');
        this._request({tb:'drillUp'}, false);
    },
    
    _onSelectPage: function(pgTxt) {
        bobj.crv.logger.info('UIAction Toolbar.SelectPage ' + pgTxt);
        this._request({tb:'gototext', text:pgTxt}, bobj.crv.config.useAsync, true, this._getPageNavigationUpdatePack());    
    },
    
    _onZoom: function(zoomTxt) {
        bobj.crv.logger.info('UIAction Toolbar.Zoom ' + zoomTxt);
        var updatePack = new bobj.crv.Async.UpdatePack();
        updatePack.setUpdateReportPage(true);
        updatePack.setRefreshLayout(true);
        this._request({tb:'zoom', value:zoomTxt}, bobj.crv.config.useAsync, true, updatePack);    
    },
    
    _onExport: function() {
        if (this._viewer._export) {
            bobj.crv.logger.info('UIAction Toolbar.Export');
            this._viewer._export.show(true);
        }
    },
    
    _onPrint: function() {
        var printComponent = this._viewer._print;
        if (printComponent) {			
            if (printComponent.isActxPrinting) {
                bobj.crv.logger.info('UIAction Toolbar.Print ActiveX');
                var pageState = bobj.crv.stateManager.getCompositeState();
                var postBackData = this._ioHandler.getPostDataForPrinting(pageState, this._name);
                this._viewer._print.show(true, postBackData);
            }
            else {
                bobj.crv.logger.info('UIAction Toolbar.Print PDF');
                this._viewer._print.show(true);
            }
        }
    },

    _onResizeToolPanel: function(width) {
        this._setCommonProperty('toolPanelWidth', width);
        this._setCommonProperty('toolPanelWidthUnit', 'px');
    },
    
    _onHideToolPanel: function() {
        bobj.crv.logger.info('UIAction Toolbar.HideToolPanel');
        this._setCommonProperty('toolPanelType', bobj.crv.ToolPanelType.None);
    },
    
    _onShowParamPanel: function() {
        bobj.crv.logger.info('UIAction Toolbar.ShowParamPanel');
        this._setCommonProperty('toolPanelType', bobj.crv.ToolPanelType.ParameterPanel);
    },
    
    _onShowGroupTree: function() {
        bobj.crv.logger.info('UIAction Toolbar.ShowGroupTree');
        this._setCommonProperty('toolPanelType', bobj.crv.ToolPanelType.GroupTree);
    },
    
    _onDrilldown: function(drillargs) {
        bobj.crv.logger.info('UIAction Report.Drilldown');
        this._request(drillargs, false);
    },
    
    _onDrilldownSubreport: function(drillargs) {
        bobj.crv.logger.info('UIAction Report.DrilldownSubreport');
        this._request(drillargs, false);
    },
    
    _onDrilldownGraph: function(event, graphName, branch, offsetX, offsetY, pageNumber, nextpart, twipsPerPixel) {
        if (event) {
            bobj.crv.logger.info('UIAction Report.DrilldownGraph');
            var mouseX, mouseY;
            
            if(_ie || _saf) {
                mouseX = event.offsetX;
                mouseY = event.offsetY;				
            }
            else {
                mouseX = event.layerX;
                mouseY = event.layerY;				
            }
            
            var zoomFactor = parseInt(this._getCommonProperty('zoom'), 10);
            zoomFactor = (isNaN(zoomFactor) ? 1 : zoomFactor/100);            
            this._request({ name:encodeURIComponent(graphName),
                            brch:branch,
                            coord:(mouseX*twipsPerPixel/zoomFactor + parseInt(offsetX, 10)) + '-' + (mouseY*twipsPerPixel/zoomFactor +parseInt(offsetY, 10)),
                            pagenumber:pageNumber,
                            nextpart:encodeURIComponent(nextpart)}, 
                            false);
        };
    },
    
    _onDrilldownGroupTree: function(groupName, groupPath, isVisible) {
        bobj.crv.logger.info('UIAction GroupTree.Drilldown');
        var encodedGroupName = encodeURIComponent(groupName);
        if (!isVisible) {
            this._request({brch:groupPath, drillname:encodedGroupName}, false);
        }
        else {
            var updatePack = new bobj.crv.Async.UpdatePack();
            updatePack.setUpdateReportPage(true);
            updatePack.setRequiresScrolling(true);
            updatePack.setUpdateToolbar(true);
            this._request({grp:groupPath, drillname:encodedGroupName}, bobj.crv.config.useAsync, true, updatePack);
        }
    },
    
    _onRetrieveGroupTreeNodeChildren: function(groupPath) {
        var updatePack = new bobj.crv.Async.UpdatePack();
        updatePack.setUpdateGroupTree(true);
        updatePack.setGroupTreePath(groupPath); 
        this._request({grow:groupPath}, bobj.crv.config.useAsync, true, updatePack);
    },
    
    /*
     * Removes groupPath from currentExpandedPaths in current view's state
     */
    _onCollapseGroupTreeNode: function(groupPath) {
        bobj.crv.logger.info('UIAction GroupTree.CollapseNode');
        var expPathPointer = this.getCurrentExpandedPaths(); // expPathPointer is assigned to expanded paths in memory
        var groupPathArray = groupPath.split('-');

        for(var i = 0 , end = groupPathArray.length - 1; i <= end ; i++) {
            var nodeID = groupPathArray[i];
            if(expPathPointer[nodeID]) {
                if(i == end) {
                    delete expPathPointer[nodeID];
                    return;
                }
                expPathPointer = expPathPointer[nodeID];
            }
            else {
                return;
            }
        }         

    },
    
    _onExpandGroupTreeNode: function(groupPath) {
        bobj.crv.logger.info('UIAction GroupTree.ExpandNode');
        var expPathPointer = this.getCurrentExpandedPaths();
        var groupPathArray = groupPath.split('-');
        // Iterates through groupPath, and adds indxes to currentExpandedPaths if not existing
        for(var i = 0 , end = groupPathArray.length; i < end; i++) {
            var nodeID = groupPathArray[i];
            if(!expPathPointer[nodeID]) {
                expPathPointer[nodeID] = {};
            }
            expPathPointer = expPathPointer[nodeID];
        }   
        
    },
    
    _onRefresh: function() {
        bobj.crv.logger.info('UIAction Toolbar.Refresh');
        this._request({tb:'refresh'}, false);
    },
    
    _onSearch: function(searchText) {
        bobj.crv.logger.info('UIAction Toolbar.Search');
        var updatePack = new bobj.crv.Async.UpdatePack();
        updatePack.setUpdateReportPage(true);  
        updatePack.setUpdateToolbar(true); 
        updatePack.setRequiresScrolling(true);
        this._request({tb:'search', text:encodeURIComponent(searchText)}, bobj.crv.config.useAsync, true, updatePack);
    },
    
    _onFlexParam: function(paramData){
        this._request({'crprompt':'flexPromptingSetValues', 'paramList':paramData}, false);
    },
    
    _onFlexLogon: function(logonData){

	for (var i = 0, len = logonData.length; i < len; i++) {
            this._addRequestField(logonData[i].field, logonData[i].value);
        }

        this._request({'crprompt':'logon'}, false);
    },
    
    _onSubmitPromptEnginePrompts: function(formName) {
        var isPromptDialogVisible = (this._viewer && this._viewer._promptDlg && this._viewer._promptDlg.isVisible());
        var useAsync = isPromptDialogVisible;

        /*
         * this._name is used to get a unique id for prompt variables
         * For dhtml and JSF viewer it will be the name of the viewer
         * For webform viewer it will be the 'unique UI id'
         */
        var valueIDKey = 'ValueID' + this._name;
        var contextIDKey = 'ContextID' + this._name;
        var contextHandleIDKey = 'ContextHandleID' + this._name;

        var valueID = document.getElementById(valueIDKey);
        if (valueID) {
            this._addRequestField(valueIDKey, valueID.value);
        }
        
        var contextID = document.getElementById(contextIDKey);
        if (contextID) {
            this._addRequestField(contextIDKey, contextID.value);
        }
        
        var contextHandleID = document.getElementById(contextHandleIDKey);
        if (contextHandleID) {
            this._addRequestField(contextHandleIDKey, contextHandleID.value);
        }
        
        // "isAdvancedDialog" is used by Java DHTML viewer to differentiate between regular prompting and advanced dialog prompting
        // WebForm viewer doesn't need it since all async requests are handled by RaiseCallbackEvent()
        this._request({'crprompt':'pmtEngine', 'isAdvancedDialog':isPromptDialogVisible}, useAsync);
        
        // These elements are dynamically created - we should delete them as soon after their job is done.
        this._removeRequestField(valueIDKey);
        this._removeRequestField(contextIDKey);
        this._removeRequestField(contextHandleIDKey);
        
    },
      
    _onSubmitStaticPrompts: function(formName) {
        this._addRequestFields(formName);
        this._request({'crprompt':'param'}, false);
    },
    
    _onSubmitDBLogon: function(formName) {
        this._addRequestFieldsFromContent(this._promptPage.contentId);
        this._request({'crprompt':'logon'}, false);
    },

    _onSubmitExport: function (start, end, format) {
        var isRange = true;
        if (!start && !end) {
            isRange = false;
        }
        
        if (!format) {
            format = 'PDF';
        }
        
        var reqObj = {tb:'crexport', text:format, range:isRange+''};
        if (isRange) {
            reqObj['from'] = start + '';
            reqObj['to'] = end + '';
        }

         bobj.crv.logger.info('UIAction Export.Submit ' + format);
        // we want to redirect export requests to a Servlet (ASP should do nothing different)
        if (this._ioHandler instanceof bobj.crv.ServletAdapter || this._ioHandler instanceof bobj.crv.FacesAdapter) {
            this._ioHandler.redirectToServlet ();
            this._ioHandler.addRequestField ('ServletTask', 'Export');
        }

        var callback = null;
        this._request(reqObj, false, false);
    },
    
    _onCancelParamDlg: function() {
        bobj.crv.logger.info('UIAction PromptDialog.Cancel');
        this._viewer.hidePromptDialog();
    },
    
    _onReceiveParamDlg: function(html) {
        this._viewer.showPromptDialog(html);
    },
    
    _onSort: function(sortArgs) {
        bobj.crv.logger.info('UIAction Report.Sort');
        this._request(sortArgs, false);
    },
    
    _onNavigateReportPart: function(navArgs) {
        bobj.crv.logger.info('UIAction ReportPart.Navigate');
        this._request(navArgs, false);
    },
    
    _onNavigateBookmark: function(navArgs) {
        bobj.crv.logger.info('UIAction Report.Navigate');
        this._request(navArgs, false);
    },
    
    getCurrentExpandedPaths: function() {
        var viewState = this._getViewState();
        if(viewState) {
            return viewState.gpTreeCurrentExpandedPaths;
        }

        //This return shouldn't get exectued
        return {};
    },
    
    applyParams: function(params) {
        // TODO Dave can we just set the parsm into state since they've 
        // gone through client side validation?
        if (params) {
            bobj.crv.logger.info('UIAction ParameterPanel.Apply');
            if (this._ioHandler instanceof bobj.crv.ServletAdapter || this._ioHandler instanceof bobj.crv.FacesAdapter) {
                params = this._encodeParameters(params);
            }
            this._request({crprompt: 'paramPanel', paramList: params});
        }
    },
    
    showAdvancedParamDialog: function(paramController) {
    	if (!paramController) {
    		return;
        }

    	var param = paramController._findParam(paramController._selected);
        if (!param) {
        	return;
        }
        
    	if (this._viewer.getPromptingType().toLowerCase() == bobj.crv.Viewer.PromptingTypes.FLEX) {
		var servletURL = "";
		if (this._ioHandler instanceof bobj.crv.ServletAdapter || this._ioHandler instanceof bobj.crv.FacesAdapter) {
			servletURL = this._ioHandler._servletUrl;	
		}

    		this._viewer.showFlexPromptDialog(paramController, param, servletURL);
    	} else {
    		var clonedParam = MochiKit.Base.clone(param);
            clonedParam.defaultValues = null; //ADAPT00776482
            if (this._ioHandler instanceof bobj.crv.ServletAdapter || this._ioHandler instanceof bobj.crv.FacesAdapter) {
                // we need to clone the value again
                clonedParam.value = MochiKit.Base.clone(param.value);
                clonedParam = this._encodeParameter(clonedParam);
            }
            this._request({promptDlg: clonedParam}, true);    
    	}
    },
    
    // TODO Hlaing: move _encodeParameters and _encodeParameter to ParameterController for both Java and .NET(ADAPT00962914)
    _encodeParameters: function(params) {
        if (params) {
            for (var i = 0, len = params.length; i < len; i++) {
                params[i] = this._encodeParameter(params[i]);
            }
        }
        
        return params;
    },
    
    _encodeParameter: function(p) {
        // we only worry about the "%" sign in the "string" values, param name and the report name.
        // ignore the other properties of the parameter because they are not used on the server side
        if (p) {
            if (p.value && p.valueDataType == bobj.crv.params.DataTypes.STRING) {
                for (var i = 0, valuesLen = p.value.length; i < valuesLen; i++) {
                    if (bobj.isString(p.value[i])) { //discrete value
                        p.value[i] = encodeURIComponent(p.value[i]);
                    }
                    else if (bobj.isObject(p.value[i])) { //range value
                        if (p.value[i].beginValue) {
                            p.value[i].beginValue = encodeURIComponent(p.value[i].beginValue);
                        }
                        if (p.value[i].endValue) {
                            p.value[i].endValue = encodeURIComponent(p.value[i].endValue);
                        }
                    }
                }
            }
            
            if (p.paramName) {
                p.paramName = encodeURIComponent(p.paramName);
            }
            
            if (p.reportName) {
                p.reportName = encodeURIComponent(p.reportName);
            }
        }
        
        return p;
    },
    
    /**
     * Set a property in the state associated with the current report view
     *
     * @param propName [String]  The name of the property to set
     * @param propValue [Any]    The value of the property to set
     */
    _setViewProperty: function(propName, propValue) {
        var viewState = this._getViewState();
        if (viewState) {
            viewState[propName] = propValue;    
        }    
    },
    
    /**
     * Get a property in the state associated with the current report view
     *
     * @param propName [String]  The name of the property to retrieve
     */
    _getViewProperty: function(propName) {
        var viewState = this._getViewState();
        if (viewState) {
            return viewState[propName];
        }
        return null;
    },
    
    /**
     * Set a property that's shared by all report views from the state 
     *
     * @param propName [String]  The name of the property to set
     * @param propValue [String]  The value to set
     */
    _setCommonProperty: function(propName, propValue) {
        var state = this._getCommonState();
        if (state) {
            state[propName] = propValue;
        }
    },
    
    /**
     * Get a property that's shared by all report views from the state 
     *
     * @param propName [String]  The name of the property to retrieve
     */
    _getCommonProperty: function(propName) {
        var state = this._getCommonState();
        if (state) {
            return state[propName];
        }
        return null;
    },
    
    /**
     * Set the UI properties to match the state associated with viewId
     *
     * @param viewId [String - optional]  
     */ 
    _updateUIState: function(viewId) {
        
    },
    
    /**
     * Get the state associated with the current report view
     *
     * @return State object or null 
     */
    _getViewState: function() {
        var compState = bobj.crv.stateManager.getComponentState(this._name);
        if (compState && compState.curViewId) {
            return compState[compState.curViewId];
        }
        return null;
    },
    
    /**
     * Get the state that's common to all report views
     *
     * @return State object or null
     */ 
    _getCommonState: function() {
        var compState = bobj.crv.stateManager.getComponentState(this._name);
        if (compState) {
            return compState.common;
        }
        return null;
    },
    
    /**
     * Create CRPrompt instances from interactive parameters in state and pass 
     * them to the Viewer widget so it can display them in the parameter panel.
     */
    _setInteractiveParams: function(paramList) {
        if (!this._ioHandler.canUseAjax()) {
            var paramPanel = this._viewer.getParameterPanel();
            if (paramPanel) {
                paramPanel.showError(L_bobj_crv_InteractiveParam_NoAjax);
            }
            return;
        }
        
        if (!paramList) {
            var stateParamList = this._getCommonProperty('iactParams');
        
            if (stateParamList) {
                var Parameter = bobj.crv.params.Parameter;
                var paramList = [];
            
                for (var i = 0; i < stateParamList.length; ++i) {
                    paramList.push(new Parameter(stateParamList[i]));     
                }
            }
        }
        
        if (paramList && paramList.length) {
            var paramPanel = this._viewer.getParameterPanel();
            if (paramPanel) {
                var paramOpts = this._getCommonProperty('paramOpts');
                this._paramCtrl = new bobj.crv.params.ParameterController(paramPanel, this, paramOpts);
                this._paramCtrl.setParameters(paramList);
            }
        }
    },
    
    _updateInteractiveParams: function(update) {
        if (update.resolvedFields) {
            this._viewer.hidePromptDialog(); 
            
            for (var i = 0; i < update.resolvedFields.length; i++) {
            	var param = new bobj.crv.params.Parameter(update.resolvedFields[i]);
                this._paramCtrl.updateParameter(param.paramName, param.getValue());
            }
            this._paramCtrl._updateToolbar();
        }
        else {
            this._viewer.showPromptDialog(update.html); 
        }    
    },
    
    _request: function(evArgs, allowAsynch, showIndicator, updatePack) {
        var pageState = bobj.crv.stateManager.getCompositeState();
        var bind = MochiKit.Base.bind;
        var defaultCallback = bind(this._onResponse, this, updatePack, evArgs);
        var defaultErrCallback = bind(this._onIOError, this);
        if (!bobj.isBoolean (showIndicator)) {
            showIndicator = true;
        }

        if (this._reportProcessing && showIndicator) {
            this._reportProcessing.delayedShow (false);
        }
        
        var deferred = this._ioHandler.request(pageState, this._name, evArgs, allowAsynch, defaultCallback, defaultErrCallback);

        if (deferred) {            
            if (this._reportProcessing && showIndicator) {
                this._reportProcessing.setDeferred (deferred);
            }
        
            deferred.addCallback(defaultCallback);

            deferred.addErrback(defaultErrCallback);
        }
    },
    
    _onResponse: function(updatePack, evArgs, response) {
        var json = null;
        if (bobj.isString(response)) {
            json = MochiKit.Base.evalJSON(response);
        } else {
            json = MochiKit.Async.evalJSONRequest(response);
        }

        if (json) {
            if (json.needsReload) {
                this._request(evArgs, false, true, updatePack);
                return;
            }

            if (json.status && this._viewer && (json.status.errorMessage || json.status.debug) ) { 
                var errorMessage = json.status.errorMessage || L_bobj_crv_RequestError;
                this._viewer.showError(errorMessage, json.status.debug);
            }
            
            if (json.state) {
                var jsonState = json.state;
                if (bobj.isString(jsonState)) {
                    jsonState = MochiKit.Base.evalJSON(jsonState);
                }
                bobj.crv.stateManager.setComponentState(this._name, jsonState);
            }
            
            if (json.update && json.update.promptDlg) {				
                this._updateInteractiveParams(json.update.promptDlg);
                bobj.crv.logger.info('Update InteractiveParams');    
            }
            if (json.update && this._viewer && updatePack) {				
                this._viewer.update(json.update, updatePack);
                bobj.crv.logger.info('Update Viewer');
            }
        }
        
        if (this._reportProcessing) {
            this._reportProcessing.cancelShow ();
        }
    },    
    _onIOError: function(response) { 
    
        if (this._reportProcessing.wasCancelled () == true) {
            return;
        }
        
        if (this._viewer) {
            var error = this._ioHandler.processError (response);
            var detailText = '';
            if (bobj.isString(error)) {
              detailText = error;
            }
            else {
                for (var i in error) {
                    if (bobj.isString(error[i]) || bobj.isNumber(error[i])) {
                        detailText += i + ': ' + error[i] + '\n';     
                    }
                }
            }

            this._viewer.showError(L_bobj_crv_RequestError, detailText);    
        }

        if (this._reportProcessing) {
            this._reportProcessing.cancelShow ();
        }
    },
    
    _saveViewState: function() {
        var pageState = bobj.crv.stateManager.getCompositeState();
        this._ioHandler.saveViewState(pageState, this._name);
    },
    
    /**
     * Private. Retrieve all children of the given form and add them to the request.
     *
     * @param formName [String]  Name of the form
     */
    _addRequestFields: function(formName) {
        var frm = document.getElementById(formName);
        if (frm) {
            for (var i in frm) {
                var frmElem = frm[i];
                if (frmElem && frmElem.name && frmElem.value) {
                    this._addRequestField(frmElem.name, frmElem.value);
                }
            }
        }
    },

    /**
     * Private. Retrieve all input fields inside the content div element and add them to the request.
     *
     * @param contentId [String]  Id of the containing div element
     */
    _addRequestFieldsFromContent: function(contentId) {
        var parent = document.getElementById(contentId);
        if (!parent)
            return;

        var elements = MochiKit.DOM.getElementsByTagAndClassName("input", null, parent);
            
        for (var i in elements) {
            var inputElement = elements[i];
            if (inputElement && inputElement.name && inputElement.value) {
                this._addRequestField(inputElement.name, inputElement.value);
            }
        }
    },
    
    /**
     * Private. Add the given name and value as a request variable.
     *
     * @param fldName [String]  Name of the field
     * @param fldValue [String] Value of the field
     */
    _addRequestField: function(fldName, fldValue) {
        this._ioHandler.addRequestField(fldName, fldValue);
    },
    
    /**
     * Private. Add the given name and value as a request variable.
     *
     * @param fldName [String]  Name of the field
     */
    _removeRequestField: function(fldName) {
        this._ioHandler.removeRequestField(fldName);
    },
    
    _onHyperlinkClicked: function(args) {
        args = MochiKit.Base.parseQueryString(args);
        var ls = this._viewer.getEventListeners('hyperlinkClicked');
        var handled = false;
        if (ls) {
            for (var i = 0, lsLen = ls.length; i < lsLen; i++) {
                if (ls[i](args) == true){
                    handled = true;
                }
            }
        }
        
        if (handled) {return;}

        var w = window;
        if (args.target && args.target != '_self'){
            w.open(args.url, args.target);
        } else {
            w.location = args.url;
        }
    	
    }
};


