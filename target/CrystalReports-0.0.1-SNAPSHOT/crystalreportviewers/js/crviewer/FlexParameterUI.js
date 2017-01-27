/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof bobj.crv.params.FlexParameterUI == 'undefined') {
    bobj.crv.params.FlexParameterUI = {};
}

/*
================================================================================
FlexParameterUI

Base functionality for flex prompting UI
================================================================================
*/

bobj.crv.params.FlexParameterUI = function() {
    var _swfID = [];
    var _swf = [];
    var _promptData = [];
    var _paramCtrl = [];
    var _currentIParam = [];
    var _closeDialogCallBack = [];
    var _viewerLayoutType = [];
    var _moveArea;
    
    // Holder for information about interactive parameters
    var _iParamsPromptUnitData = [];
    var _iParamsParamData = [];
};

bobj.crv.params.FlexParameterUI.setViewerLayoutType = function(viewerName, layout) {
    if (!this._viewerLayoutType) {
        this._viewerLayoutType = [];
    }
    
    this._viewerLayoutType[viewerName] = layout;
};

bobj.crv.params.FlexParameterUI.setPromptData = function(viewerName, promptData) {
    if (!this._promptData) {
        this._promptData = [];
    }
    
    this._promptData[viewerName] = promptData;
};

bobj.crv.params.FlexParameterUI.setCurrentIParamInfo = function(viewerName, paramCtrl, param) {
    if (!this._paramCtrl) {
        this._paramCtrl = [];
    }
    
    if (!this._currentIParam) {
        this._currentIParam = [];
    }
    
    this._paramCtrl[viewerName]  = paramCtrl;
    this._currentIParam[viewerName]  = param;
};

bobj.crv.params.FlexParameterUI.setCloseDialogCallBack = function(viewerName, closeDialogCallBack) {
    if (!this._closeDialogCallBack) {
        this._closeDialogCallBack = [];
    }    

    this._closeDialogCallBack[viewerName] = closeDialogCallBack;
};

bobj.crv.params.FlexParameterUI.addIParamPromptUnitData = function (viewerName, promptUnitID, paramNames, promptData)
{
    if (!this._iParamsPromptUnitData) {
        this._iParamsPromptUnitData = [];
    }
    
    if (!this._iParamsPromptUnitData[viewerName]) {
        this._iParamsPromptUnitData[viewerName] = [];
    }
    
    if (!this._iParamsParamData) {
        this._iParamsParamData = [];
    }
    
    if (!this._iParamsParamData[viewerName]) {
        this._iParamsParamData[viewerName] = [];
    }
    
    this._iParamsPromptUnitData[viewerName][promptUnitID] = promptData;
    for(var i = 0, len = paramNames.length; i < len; i++) {
        var paramName = paramNames[i];
        this._iParamsParamData[viewerName][paramName] = promptUnitID;
    }
};

bobj.crv.params.FlexParameterUI.getSWF = function(viewerName) {
    if (!this._swfID || !this._swfID[viewerName]) {
        return;
    }

    if (!this._swf) {
        this._swf = [];
    }

    if(this._swf[viewerName]) {
        return this._swf[viewerName];
    } else {
        var swf = document.getElementById(this._swfID[viewerName]);
        if (!swf) {
            return;
        }
        this._swf[viewerName] = swf;
        return swf;
    }
};

bobj.crv.params.FlexParameterUI.getInstallHTML = function () {
	return L_bobj_crv_FlashRequired.replace("{0}", "<br><a href='http://www.adobe.com/go/getflash/' target='_blank'>") + "</a>";
};

bobj.crv.params.FlexParameterUI.checkFlashPlayer = function () {
	return swfobject.hasFlashPlayerVersion("9.0.0");
};

/**
 * Creates the swf and replaces the div specified with the flash object.
 */ 
bobj.crv.params.FlexParameterUI.createSWF = function(viewerName, divID, servletURL, isIParamDialog) {
    if (!this._swfID) {
        this._swfID = [];
    }
    
    bobj.crv.logger.info('Create the SWF');
    
    if (this.checkFlashPlayer()){
        var lang = bobj.crv.getLangCode ();
        var swfBaseURL = bobj.crvUri("../../swf/");
        var swfPath = swfBaseURL + "prompting.swf";
        var swfID = bobj.uniqueId();
    
        var flashvars = {"eventTarget":viewerName, "locale":lang, "isIParamDialog":isIParamDialog, "baseURL":swfBaseURL, "servletURL":servletURL};
        
        // Important: Do not specify play=true as one of the params. If this is set to true we could end up in an infinite loop reloading
        // the swf when viewing using the embedded browser in eclipse.
        var params = {menu:"false", wmode:"window", allowscriptaccess:"sameDomain"};
        var attributes = {id:swfID, name:swfID, style:'z-index:' + bobj.constants.modalLayerIndex};

        // Does not work in IE for some reason, used in other browsers to hide the 
        // dialog until it has been positioned properly to prevent snapping.
        if (!MochiKit.Base.isIE()){
           document.getElementById(divID).parentNode.style.visibility = 'hidden';
        }

        swfobject.embedSWF(swfPath, divID, "360", "50", "9.0.0", "", flashvars, params, attributes);
        this._swfID[viewerName] = swfID;
        
        var v = getWidgetFromID(viewerName);
        if (v && v._reportProcessing){
        	v._reportProcessing.delayedShow(false);
        }
    } else {
    	document.getElementById(divID).innerHTML = "<p>" + this.getInstallHTML() +"</p>";
    }
};


/**
 * This function will initialize the data in the flex swf with the
 * current state of the parameter ui. The Flex swf will call back to 
 * this method when it has first been created and all external interface
 * connections have been setup. If the swf has already been created this will 
 * be called when showing the parameter UI.
 */ 
bobj.crv.params.FlexParameterUI.init = function (viewerName) {
    if (!viewerName || !this._swfID || !this._swfID[viewerName]) {
        return; 
    }

    bobj.crv.logger.info('Init the SWF');
    
    var swf = this.getSWF(viewerName);
    if (!swf) {
        return;
    }
    
    var v = getWidgetFromID(viewerName);
    if (v && v._reportProcessing){
    	v._reportProcessing.cancelShow();
    }
    
    if (swf.setStateInfo){
        var toJSON = MochiKit.Base.serializeJSON;
        swf.setStateInfo(encodeURIComponent(toJSON(bobj.crv.stateManager.getCompositeState())));
    }

    if (swf.setIdealHeight){
        var lTypes = bobj.crv.Viewer.LayoutTypes;
        var layout = lTypes.CLIENT;
        if (this._viewerLayoutType && this._viewerLayoutType[viewerName]){
            layout = this._viewerLayoutType[viewerName];
        }
        
        var lDim = MochiKit.Style.getElementDimensions(getLayer(viewerName));
        var min = layout === lTypes.FIXED ? 0 : 400;
        
        swf.setIdealHeight(Math.max(min, lDim.h - 20));
     }
    
    if (this._currentIParam && this._currentIParam[viewerName]){
        if(!this._iParamsParamData || !this._iParamsParamData[viewerName] || !this._iParamsPromptUnitData || !this._iParamsPromptUnitData[viewerName] ) {
            this.setPromptData(viewerName, null);
        } 
        else {
            var promptUUID = this._iParamsParamData[viewerName][this._currentIParam[viewerName].paramName];
            if (!promptUUID){
                this.setPromptData(viewerName, null);
            }
            
            var promptData = this._iParamsPromptUnitData[viewerName][promptUUID];
            this.setPromptData(viewerName, promptData);
        }
    }
    
    if(this._promptData && this._promptData[viewerName] && swf.setPromptData){
        swf.setPromptData(this._promptData[viewerName]);
    }
};

/**
 * Flex callback for setting the values from the flex widget
 */ 
bobj.crv.params.FlexParameterUI.setIParamValues = function(viewerName, isCascading, vals, updatedXMLData)
{
    if (!this._paramCtrl || !this._currentIParam || !this._iParamsParamData || !this._iParamsPromptUnitData) {
        return;
    }
    
    var cParam = this._currentIParam[viewerName];
    var pCtrl = this._paramCtrl[viewerName];
    var pData = this._iParamsParamData[viewerName];
    var pUnitData = this._iParamsPromptUnitData[viewerName];
    
    if (!cParam || !pCtrl || !pData || !pUnitData) {
        return;
    }
    
    var cParamName = cParam.paramName;
    
    if (isCascading){
        for(var i = 0, len = vals.length; i < len; i++) {
            var value = vals[i];
            if (!value.name || !value.values){
                continue;
            }
           
            pCtrl.updateParameter(value.name, value.values);
        }
    } else {
        pCtrl.updateParameter(cParamName, vals);
    }
    pCtrl._updateToolbar();
    
    var uid = pData[cParamName];
    if (uid){
        pUnitData[uid] = updatedXMLData;
    }
    
    this.closeIParamDialog(viewerName);
};

/**
 * Flex callback for closing the current dialog window.
 */ 
bobj.crv.params.FlexParameterUI.closeIParamDialog = function (viewerName)
{
    if (this._closeDialogCallBack && this._closeDialogCallBack[viewerName]) {
        this._closeDialogCallBack[viewerName]();
    }
};

/**
 * Flex callback for adjusting the size of the swf to fit the number of
 * prompts being displayed.
 */ 
bobj.crv.params.FlexParameterUI.resize = function (viewerName, height, width)
{
    var swf = this.getSWF(viewerName);
    if (swf){
        bobj.crv.logger.info('Resizing the SWF h:' + height + ' w:' + width);
        swf.style.width = width + 'px';
        swf.style.height = height + 'px';
        
        var P_STYLE = swf.parentNode.style;
        P_STYLE.position = 'absolute';
        P_STYLE.visibility = 'visible';
    }
};

/**
 * Flex callback for adjusting the size of the swf to fit the number of
 * prompts being displayed.
 */ 
bobj.crv.params.FlexParameterUI.center = function (viewerName, wOnly)
{
    var swf = this.getSWF(viewerName);
    if (swf){
        var LOG = bobj.crv.logger;
        LOG.info('Centering the SWF');
        
        var l = getLayer(viewerName);
        if (!l){
            LOG.error('Could not find the viewer:' + viewerName);
            return;
        }
        
        var vPos = MochiKit.Style.getElementPosition(l);
        var vDim = MochiKit.Style.getElementDimensions(l);
        var sDim = MochiKit.Style.getElementDimensions(swf);
        
        var P_STYLE = swf.parentNode.style;
        if (!wOnly){
           P_STYLE.top = Math.max(vPos.y, vPos.y + (vDim.h / 2) - (sDim.h / 2)) + 'px';  
        }else {
           P_STYLE.top = (vPos.y + 10) + 'px';
        }
        
        P_STYLE.left = Math.max(vPos.x, vPos.x + (vDim.w / 2) - (sDim.w / 2)) + 'px';
        
        if (swf.focus != undefined){
        	swf.focus();
        }
    }
};

/**
 * Flex callback to start moving the dialog
 */ 
bobj.crv.params.FlexParameterUI.startMove = function (viewerName)
{
    var swf = this.getSWF(viewerName);
    if (swf){
        
        if (this._moveArea){
            return;
        }
        
        this._moveArea = document.createElement('div');
        this._moveArea.id = bobj.uniqueId();

        MOVE_STYLE = this._moveArea.style;
       
        var STYLE = swf.style;
        var P_STYLE = swf.parentNode.style;
        
        MOVE_STYLE.top = P_STYLE.top;
        MOVE_STYLE.left = P_STYLE.left;
        MOVE_STYLE.width = STYLE.width;
        MOVE_STYLE.height = STYLE.height;
        MOVE_STYLE.border = '1px'; 
        MOVE_STYLE.borderStyle = 'solid'; 
        MOVE_STYLE.borderColor = '#000000'; 
        MOVE_STYLE.backgroundColor = '#FFFFFF';
        MOVE_STYLE.position = 'absolute'; 
        MOVE_STYLE.opacity = 0.50;
        MOVE_STYLE.filter = 'alpha(opacity=50)';
        MOVE_STYLE.zIndex = bobj.constants.modalLayerIndex - 1;
        
        document.body.appendChild(this._moveArea);
        document.body.style.cursor = 'move';
    }
};

/**
 * Flex callback when finished moving the dialog
 */ 
bobj.crv.params.FlexParameterUI.stopMove = function (viewerName)
{
    var swf = this.getSWF(viewerName);
    if (swf){
        
        var pos = MochiKit.Style.getElementPosition(this._moveArea);
        MochiKit.Style.setElementPosition(swf.parentNode, pos);
        
        document.body.removeChild(this._moveArea);
        delete this._moveArea;
        
        document.body.style.cursor = 'default';
    }
};

/**
 * Flex callback for moving the dialog.
 * x is the amount to move on the x axis, -:left +:right
 * y is the amount to move on the y axis, -:up +:down
 */ 
bobj.crv.params.FlexParameterUI.Move = function (viewerName, x, y)
{
    var swf = this.getSWF(viewerName);
    if (swf){
        var LOG = bobj.crv.logger;
        LOG.info('doMove Called viewer:' + viewerName + ' x:' + x + ' y:' + y);
        
        var l = getLayer(viewerName);
        if (!l){
            LOG.error('Shifting SWF could not find the viewer:' + viewerName);
            return;
        }
        
        var m = this._moveArea;
        if (!m){
            LOG.error('Unable to move SWF, no move area available');
            return;
        }
        
        var mX = m.offsetLeft;
        var mY = m.offsetTop;
        var mH = m.offsetHeight;
        var mW = m.offsetWidth;
        var vX = l.offsetLeft;
        var vY = l.offsetTop;
        var vH = l.offsetHeight;
        var vW = l.offsetWidth;
        
        var newX = mX + x;
        var newY = mY + y;
        
        if (newY < vY){
            newY = vY;
        } else if (newY + mH > vY + vH){
            newY = vH - mH;
        }
        
        if (newX < vX){
            newX = vX;
        } else if (newX + mW > vX + vW){
            newX = vW - mW;
        }
        
        m.style.top = newY + 'px';
        m.style.left = newX + 'px';
        
        LOG.info('Moved the SWF to x:' + newX + ' y:' + newY);
        
    }
};

bobj.crv.params.FlexParameterUI.setParamValues = function (viewerName, paramData)
{
    bobj.crv.logger.info('setting parameter values');
    bobj.event.publish('crprompt_flexparam', viewerName, paramData);
};


bobj.crv.params.FlexParameterUI.logon = function (viewerName, logonData)
{
    bobj.crv.logger.info('logging on');
    bobj.event.publish('crprompt_flexlogon', viewerName, logonData);
};

