/* Copyright (c) Business Objects 2006. All rights reserved. */

/* TODO Dave
 * - Use delete button to set value to empty string if it can't be removed
 */

/**
 * ParameterController creates and controls the widgets that show and edit
 * parameter values in the interactive parameter panel.
 *
 * @param panel [ParameterPanel] Panel that will contain the parameter widgets
 * @param viewerCtrl [ViewerListener] Controller for the entire viewer 
 * @param paramOpts [Object] Parameter options, such as dateTimeFormat 
 */
bobj.crv.params.ParameterController = function(panel, viewerCtrl, paramOpts) {
    this._panel = panel;
    this._viewerCtrl = viewerCtrl;
    this._paramOpts = paramOpts;
    this._paramList = null;
    this._selected = null;         // Selected parameter widget
    this._selectedValueIdx = null; // Index of selected value 
    this._disablePanel = false; // in drilldown views, the panel needs to be disabled

    var delClickCB = MochiKit.Base.bind(this._onClickTbDeleteButton,this);
    var applyClickCB = MochiKit.Base.bind(this._onClickTbApplyButton,this);
    this._panel.setToolbarCallBacks(delClickCB,applyClickCB);
};

bobj.crv.params.ParameterController.prototype = {
    
    /**
     * Set the list of parameters to display in the parameter panel.
     *
     * @param paramList [Array] List of bobj.crv.params.Parameter instances
     */
    setParameters: function(paramList) {
        var Type = bobj.crv.params.DataTypes;
        var map = MochiKit.Base.map;
        var bind = MochiKit.Base.bind;
        
        this._deleteWidgets();
        
        this._paramList = paramList;
        this._selected = null; 
        this._selectedValueIdx = null;
        
        for (var i = 0; i < paramList.length; ++i) {
            var param = paramList[i];
            
            // Adding callbacks for when a duplicate value is detected
            var hasDuplicateValueCB = bind(this._onParamHasDupValue,this, param);
            var hasNoDuplicateValueCB = bind(this._onParamHasNoDupValue, this, param);
            param.addDuplicateValuesCB(hasDuplicateValueCB, hasNoDuplicateValueCB);
            
            var getDisplayText = bind(this._getDisplayText, this, param);
            var getDefaultValue = bind(this._getDefaultValue, this, param.valueDataType,param.defaultDisplayType);
            var panelCanChangeValues = this._canPanelChangeValues(param);
            var minMaxText = this._getMinMaxText(param.valueDataType, param.minValue, param.maxValue);
            var openAdvDialogCB = MochiKit.Base.bind(this._onClickTbAdvButton, this);            
            var isReadOnly = !param.isEditable;
            var paramValue = param.getValue();
            // we need to treat the parameter as readOnly if the current view is not the MainReport
            var currentView = this._viewerCtrl.getCurrentView ();
            if(currentView && !currentView.isMainReport ()) {
            	this._disablePanel = true;
                isReadOnly = true;
                panelCanChangeValues = false;
            }
            
            // Removing Null value from value list when parameter is nullable and has only null value.
            if(param.allowNullValue == true && paramValue != null && paramValue.length == 1 && paramValue[0] == null) {
                paramValue = [];
            }

            // TODO: Post Titan, We should be delgating some of the logic to the consumer regarding parameter attributes.
            //       It will be much cleaner to pass around the entire param object rather than specific details.
            var paramWidget = bobj.crv.params.newParameterUI({
                values:           map(getDisplayText, paramValue),
                canChangeOnPanel: panelCanChangeValues,
                allowCustom:      param.allowCustomValue,
                canAddValues:     param.allowMultiValue && panelCanChangeValues,
                isReadOnlyParam:  isReadOnly,
                isPassword:       param.isPassword(),
                valueRequired:    (!param.isOptionalPrompt && !param.allowNullValue),
                defaultValues:    map(getDefaultValue, param.defaultValues || []),
                hasRowButtons:    param.allowCustomValue && panelCanChangeValues &&
                                    (param.valueDataType === Type.DATE || param.valueDataType === Type.DATE_TIME),
                rowButtonsUrl:    bobj.crvUri('images/calendar.gif'),
                openAdvDialogCB:  openAdvDialogCB,
                maxNumParameterDefaultValues: this._paramOpts.maxNumParameterDefaultValues,
                tooltip : param.getTitle()
            });    
            
            this._observeParamWidget(paramWidget);
            
            this._panel.addParameter({paramUI: paramWidget,
                                      label : param.getTitle(),
                                      isDataFetching: param.isDataFetching,
                                      isReadOnly: !param.isEditable, // this controls the strictly the readOnly.
                                                                     // This should only show if the report designer marked the parameter as readOnly.
                                      isDirty: false,
                                      selectCB: bind(this._onSelectValue, this, paramWidget, 0),
                                      openAdvCB: isReadOnly? null : openAdvDialogCB,
                                      minMaxTooltip: minMaxText
                                      });
        }
        
        this._panel.resize();
    },
    
    /**
     * Get the list of params that are displayed in the panel
     *
     * @return [Array] List of bobj.crv.params.Parameter instances or null
     */
    getParameters: function() {
        return this._paramList;    
    },
    
    /**
     * Sets the current values of the param with the same name as the one passed
     * in and updates the UI.
     *
     * @param [Parameter] 
     */
    updateParameter: function(paramName, paramValue) {
        if (paramName) {
            var index = -1;
            for (var i = 0; i < this._paramList.length; ++i) {
                if (this._paramList[i].paramName === paramName) {
                    this._paramList[i].setValue(paramValue);
                    index = i;
                    break;
                }
            }
            
            if (index != -1) {
                var paramUI = this._panel.getParameter(index);
                var getDisplayText = MochiKit.Base.bind(this._getDisplayText, this, this._paramList[index]);
                
                if(this._paramList[i].allowNullValue && paramValue.length == 1 && paramValue[0] == null) {
                    paramValue = [];
                }
                
                paramUI.setValues( MochiKit.Base.map(getDisplayText, paramValue) );
                
                if(!paramUI.valueRequired && !paramUI.canAddValues) {
                    if(paramValue.length > 0) {
                        paramUI.showRowCreater(false);
                    }
                    else {
                        paramUI.showRowCreater(true);
                    }
                }
                
                this._panel.setDirty(index, paramUI.isDirty());
            }
        }
    },
        
    /** 
     * Checks whether a parameter can be edited directly in the panel. Params
     * that can't be edited in the panel are either read-only or must be
     * edited in the Advanced Dialog.
     *
     * @param param [Parameter]
     *
     * @return [bool] True if ParameterPanel is capable of changing the 
     *                parameter's values. False otherwise.
     */
    _canPanelChangeValues: function(param) {
        return param && param.isEditable && !param.allowRangeValue && !param.editMask && !param.isDCP();
    },
    
    /**
     * Private. Deletes the parameter widgets in the panel.
     */
    _deleteWidgets: function() {
        var paramUI = this._panel.getParameter(0);
        while (paramUI) { 
            delete _widgets[paramUI.widx];
            this._panel.removeParameter(0);
            paramUI = this._panel.getParameter(0);
        }
    },
    
    /**
     * Private. Compares 2 objects that have date like members (y, m, d, h, min, s, ms)
     * returns true if all members match, false otherwise.
     */
    _compareCustomDateObject: function(valA, valB) {
        if (valA.y != valB.y) {
            return false;
        }
        
        if (valA.m != valB.m) {
            return false;
        }

        if (valA.d != valB.d) {
            return false;
        }

        if (valA.h != valB.h) {
            return false;
        }

        if (valA.min != valB.min) {
            return false;
        }

        if (valA.s != valB.s) {
            return false;
        }

        if (valA.ms != valB.ms) {
            return false;
        }
        
        return true;
    },
    
    /**
     * Private. Erom doesn't give us NULL in all cases so we need to compare against the boundary values for each type.
     * type - the value type
     * minValue - the value to check
     * returns true if the minValue is NOT equal NULL or the MIN value for the given datatype.
     */
    _hasMinBound: function(type,minValue) {
        if (minValue == null) {
            return false;
        }
        
        var Type = bobj.crv.params.DataTypes;
        switch(type) {
            case Type.STRING:
                if (minValue == 0) {
                    return false;
                }
                return true;
            case Type.DATE:
            case Type.DATE_TIME:
                absoluteMin = {y:1753, m:0, d:1, h:0, min:0, s:0, ms:0};
                return !this._compareCustomDateObject (absoluteMin, minValue);
            case Type.TIME:
                absoluteMin = {y:1899, m:11, d:30, h:0, min:0, s:0, ms:0};
                return !this._compareCustomDateObject (absoluteMin, minValue);
            case Type.NUMBER:
            case Type.CURRENCY:
                if (minValue == -3.40282346638529e+38) {
                    return false;
                }
                return true;
       }
       
       // should not get here!
       return false;
    },
    
    /**
     * Private. Erom doesn't give us NULL in all cases so we need to compare against the boundary values for each type.
     * type - the value type
     * minValue - the value to check
     * returns true if the maxValue is NOT equal NULL or the MAX value for the given datatype.
     */
    _hasMaxBound: function(type,maxValue) {
        if (maxValue == null) {
            return false;
        }
        
        var Type = bobj.crv.params.DataTypes;
        switch(type) {
            case Type.STRING:
                if (maxValue == 65534) {
                    return false;
                }
                return true;
            case Type.DATE:
                absoluteMax = {y:9999, m:11, d:12, h:0, min:0, s:0, ms:0};
                return !this._compareCustomDateObject (absoluteMax, maxValue);
            case Type.TIME:
                absoluteMax = {y:1899, m:11, d:30, h:23, min:59, s:59, ms:0};
                return !this._compareCustomDateObject (absoluteMax, maxValue);
            case Type.DATE_TIME:
                absoluteMax = {y:9999, m:11, d:12, h:23, min:59, s:59, ms:0};
                return !this._compareCustomDateObject (absoluteMax, maxValue);
            case Type.NUMBER:
            case Type.CURRENCY:
                if (maxValue == 3.40282346638529e+38) {
                    return false;
                }
                return true;
       }
       
       // should not get here!
       return false;
    },
    
    _getMinMaxText: function(type,minValue,maxValue) {
   
        var Type = bobj.crv.params.DataTypes;
        var maxValueDisplay,minValueDisplay;
        
        if(type == Type.STRING) {
            /* because min/max of string are in number format */
            minValueDisplay = this._getValueText(Type.NUMBER , minValue);
            maxValueDisplay = this._getValueText(Type.NUMBER, maxValue);
        }
        else {
            minValueDisplay = this._getValueText(type, minValue);
            maxValueDisplay = this._getValueText(type, maxValue);        
        }
        
        if(type == Type.BOOLEAN || (minValue == null && maxValue == null)) {
            return null;
        }
        
        var displayType,returnString;
        
        switch(type) {
            case Type.DATE:
                displayType = L_bobj_crv_Date;
                break;
            case Type.TIME:
                displayType = L_bobj_crv_Time;
                break;
            case Type.DATE_TIME:
                displayType = L_bobj_crv_DateTime;
                break;
            case Type.NUMBER:
                displayType = L_bobj_crv_Number;
                break;
            case Type.CURRENCY:
                displayType = L_bobj_crv_Number;
                break;
       }
       
       var hasMinBound = this._hasMinBound (type, minValue);
       var hasMaxBound = this._hasMaxBound (type, maxValue);
       switch(type) {
            case Type.STRING:
                if(hasMinBound && hasMaxBound) {
                    returnString = L_bobj_crv_ParamsStringMinAndMaxTooltip.replace("%1", minValueDisplay);
                    returnString = returnString.replace("%2",maxValueDisplay);
                }
                else if(hasMinBound) {
                    returnString = L_bobj_crv_ParamsStringMinOrMaxTooltip.replace("%1", L_bobj_crv_Minimum);
                    returnString = returnString.replace("%2", minValueDisplay);
                }
                else if(hasMaxBound) {
                    returnString = L_bobj_crv_ParamsStringMinOrMaxTooltip.replace("%1", L_bobj_crv_Maximum);
                    returnString = returnString.replace("%2", maxValueDisplay);
                }
                break;
            default: 
                if(hasMinBound && hasMaxBound) {
                    returnString = L_bobj_crv_ParamsMinAndMaxTooltip.replace("%1", displayType);
                    returnString = returnString.replace("%2",minValueDisplay);
                    returnString = returnString.replace("%3",maxValueDisplay);
                }
                else if(hasMinBound) {
                    returnString = L_bobj_crv_ParamsMinTooltip.replace("%1", displayType);
                    returnString = returnString.replace("%2", minValueDisplay);
                }
                else if(hasMaxBound) {
                    returnString = L_bobj_crv_ParamsMaxTooltip.replace("%1", displayType);
                    returnString = returnString.replace("%2", maxValueDisplay);
                }    
       }
       
       return returnString;   
    },
    /**
     * Constructs description and display value for default values
     * @param type [bobj.crv.params.DataTypes]
     * @param displayType [bobj.crv.params.DefaultValueDisplayTypes]
     * @param value   [Object] Parameter value to convert to text
     *
     * @return {value: convertedValue, desc: description}
     */
    _getDefaultValue: function(type, displayType, valueObj) {
        var displayTypes = bobj.crv.params.DefaultDisplayTypes;
        var valueText = this._getValueText(type, valueObj.value);
        var valueDesc;
        
        switch(displayType) {
            case displayTypes.Description:
                if(valueObj.desc != null && valueObj.desc.length > 0) {
                    valueDesc = valueObj.desc;
                }
                else {
                    valueDesc = valueText;
                }           
                break;
            case displayTypes.DescriptionAndValue: // Value And Description
                valueDesc = valueText;
                if(valueObj.desc != null && valueObj.desc.length > 0) {
                    valueDesc += ' - ' + valueObj.desc;
                }             
                break;

        }
                
        return valueDesc;
    
    },

    /*
     * Private. Convert value text which could contains description to value text based on default values of param
     * @param param   [bobj.crv.params.Parameter]    Value's data type (bobj.crv.params.DataTypes)
     * @param desc    [string] 
     */
    _getValueTextFromDefValueDesc: function(param, desc) {
        if(param.defaultValues && bobj.isArray(param.defaultValues)) {
            for(var i = 0 ; i < param.defaultValues.length;i++) {
                var defValueDesc = this._getDefaultValue(param.valueDataType,param.defaultDisplayType, param.defaultValues[i]);
                if(defValueDesc == desc) {
                    // if desc is equal to one of LOV's row desc, then get value text of that row
                    return this._getValueText(param.valueDataType, param.defaultValues[i].value);
                }
            }
        }
        return null;
    },
    

    /**
     * Private. Converts a parameter value to display text.
     *
     * @param type    [int]    Value's data type (bobj.crv.params.DataTypes)
     * @param isRange [bool] 
     * @param value   [Object] Parameter value to convert to text
     *
     * @return [String] Returns display text representing the value
     */
    _getValueText: function(type, value) {
        if (value === undefined) {
            return undefined;    
        }
        
        var Type = bobj.crv.params.DataTypes;
        switch(type) {
            case Type.DATE:
                return this._getDateTimeText(value, this._paramOpts.dateFormat);
            case Type.TIME:
                return this._getDateTimeText(value, this._paramOpts.timeFormat);
            case Type.DATE_TIME:
                return this._getDateTimeText(value, this._paramOpts.dateTimeFormat);
            case Type.NUMBER:
            case Type.CURRENCY:
                return this._getNumberText(value,this._paramOpts.numberFormat);    
            case Type.BOOLEAN:    
                return this._getBooleanText(value,this._paramOpts.booleanFormat);
            case Type.STRING:
            default:
                return '' + value;
        }
    },
    
    _getBooleanText: function(value, booleanFormat) {

        return booleanFormat[''+value];
    },
    
     /**
     * Private. Converts a Number value into display text.
     *
     * @param value  [int]  Parameter value to convert to text
     * @param format [{decimalSeperator,groupSeperator}]  Number format  
     *
     * @return [String] Returns display text for the value
     */   
    _getNumberText: function(value,format) {
        var dcSeperator = format.decimalSeperator;
        var gpSeperator = format.groupSeperator;
        var valueSplitted = ('' + value).split(".");
        var leftVal,rightVal,formattedValue;
        var numberSign = null;
        
        leftVal = valueSplitted[0];
        if(leftVal.length > 0 && leftVal.slice(0,1) == '-' || leftVal.slice(0,1) == '+') {
            numberSign = leftVal.slice(0,1);
            leftVal = leftVal.slice(1,leftVal.length);            
        }
        
        rightVal = (valueSplitted.length == 2) ? valueSplitted[1] : null;     
        formattedLeftVal = null;
        
        if(leftVal.length <= 3) {
            formattedLeftVal = leftVal;
        }
        else {
            var gp = null;
            var sliceIndex = null;
            while(leftVal.length > 0) {
                sliceIndex = (leftVal.length > 3) ? leftVal.length - 3 : 0;
                gp = leftVal.slice(sliceIndex,leftVal.length);
                leftVal = leftVal.slice(0, sliceIndex);
                formattedLeftVal = (formattedLeftVal == null) ? gp : gp + gpSeperator + formattedLeftVal;
            }
        }
        
        formattedValue = (rightVal != null) ? formattedLeftVal + dcSeperator + rightVal : formattedLeftVal;
        formattedValue = (numberSign != null) ? numberSign + formattedValue : formattedValue;
        return formattedValue;   
    },
    
    /**
     * Private. Converts a DateTime value into display text.
     *
     * @param value  [Object]  Parameter value to convert to text
     * @param format [String]  DateTime format  
     *
     * @return [String] Returns display text for the value
     */
    _getDateTimeText: function(value, format) {
        var date = bobj.crv.params.jsonToDate(value);
        if (date) {
            return bobj.external.date.formatDate(date, format);
        }
        return '';
    },
    
    /*
     * Looks up value in the param's defualt values list, and if it's existing, get value/desc based on valueDisplayType
     * @param value  [Object] Parameter value to convert to text
     */
    _getValueTextFromDefaultValue: function(param, value) {
         if(bobj.isArray(param.defaultValues)) {
             var hashValue = bobj.getValueHashCode(param.valueDataType,value);
             for(var i = 0 ; i < param.defaultValues.length; i++) {
                if(hashValue == bobj.getValueHashCode(param.valueDataType,param.defaultValues[i].value)) {
                    return this._getDefaultValue(param.valueDataType, param.defaultDisplayType, param.defaultValues[i]);
                }
            }
        }
        
        return null;       
    },
    
    /*
     * Converts value object to value text in order to be displayed on ParameterUI. takes into account valueDisplayType
     * IMPORTANT : use _getValueText if you want to convert param value Obj to param value text 
     */
    _getDisplayText: function(param,value) {
        if (value === undefined) {
            return undefined;    
        }
        
        if (value.lowerBoundType !== undefined || value.upperBoundType !== undefined) {
            return this._getRangeDisplayText(param, value);    
        }        
        
        var valueText = this._getValueTextFromDefaultValue(param,value);
        
        if(valueText == null) {
            valueText = this._getValueText(param.valueDataType, value);
        }
        
        return valueText;
    },
    
    /**
     * Private. Converts a range value into display text.
     *
     * @param value  [Object] Parameter value to convert to text
     * @param type   [int]    Value's data type (bobj.crv.params.DataTypes)   
     *
     * @return [String] Returns display text for the value
     */
    _getRangeDisplayText: function(param, value) {  
        var valString = '';
        
        if (value.lowerBoundType !== undefined || value.upperBoundType !== undefined)  {
            var lbType = parseInt(value.lowerBoundType, 10); 
            var ubType = parseInt(value.upperBoundType, 10); 
            
            var lowerBound = '(';
            var upperBound = ')';
            
            if (lbType == bobj.crv.params.RangeBoundTypes.INCLUSIVE) {
                lowerBound = '[';
            }
            
            if (ubType == bobj.crv.params.RangeBoundTypes.INCLUSIVE) {
                upperBound = ']';
            }
            
            var beginValue = '';
            var endValue = '';
            
            if (lbType != bobj.crv.params.RangeBoundTypes.UNBOUNDED) {
                beginValue = this._getDisplayText(param, value.beginValue);
            }
            
            if (ubType != bobj.crv.params.RangeBoundTypes.UNBOUNDED) {
                endValue = this._getDisplayText(param, value.endValue);
            }
            
            valString = lowerBound + ' ' +  beginValue;
            valString += ' .. ';
            valString += endValue + ' ' + upperBound;
        }
        else { 
            //this is a discrete value
            valString = this._getDisplayText(param, value);
        }
        
        return valString;
    },

    /**
     * Private. Converts text into a parameter value.
     *
     * @param type [int]    Value's data type (bobj.crv.params.DataTypes)
     * @param text [String] Value's display text
     *
     * @return [Object] Parameter value
     */
    _getParamValue: function(type, text) {
        if (type === undefined) {
            return undefined;    
        }
        
        var Type = bobj.crv.params.DataTypes;
        switch(type) {
            case Type.DATE:
                return this._getDateTimeParamValue(text, this._paramOpts.dateFormat);
            case Type.TIME:
                return this._getDateTimeParamValue(text, this._paramOpts.timeFormat);
            case Type.DATE_TIME:
                return this._getDateTimeParamValue(text, this._paramOpts.dateTimeFormat);
            case Type.NUMBER:
            case Type.CURRENCY:
                return this._getNumberParamValue(text,this._paramOpts.numberFormat);
            case Type.BOOLEAN:
                return this._getBooleanParamValue(text,this._paramOpts.booleanFormat);
            case Type.STRING:    
            default:
                return text;
        }
    },
  
      /**
     * Private. Converts boolean text to a paramter value
     * @param   text    [String] Value's display text
     * @param   booleanFormat    [boolean format] {true: text : false : text}
     * @return [String] 
     */  
    _getBooleanParamValue: function(text,booleanFormat) {
        if(text != null && text.length != 0) {
            return  booleanFormat["true"] == text;
        }
        else {
            return null;
        }
    },
    
    /**
     * Private. Converts Number text to a paramter value
     * @param   text    [String] Value's display text
     * @param   format  [{decimalSeperator,groupSeperator}] number format
     *
     * @return [String] 
     */
    _getNumberParamValue: function(text,format) {
        if(text == null) {
            return null;
        }
        
        var value = '';
        
        if (/[ \f\n\r\t\v\u00A0\u2028\u2029]/.test(format.groupSeperator)) {
            value = text.replace(/[ \f\n\r\t\v\u00A0\u2028\u2029]/g, '');
        }
        else {
            var gpRE = new RegExp( "\\" + format.groupSeperator, "g" );
            value = text.replace(gpRE,"")
        }
        
        return value.replace(format.decimalSeperator, ".");
    },
    
    /**
     * Private. Converts DateTime text into a parameter value.
     *
     * @param text   [String] Value's display text
     * @param format [String] DateTime format
     *
     * @return [Object] DateTime parameter value or the original value if getDateFromFormat fails
     */
    _getDateTimeParamValue: function(text, format) {
        var date = bobj.external.date.getDateFromFormat(text, format);
        if (date) {
            return bobj.crv.params.dateToJson(date);
        }
        return text;
    },
    
    /**
     * Private. Attach callbacks to a parameter widget
     *
     * @param widget [ParameterUI]
     */
    _observeParamWidget: function(widget) {
        if (widget) {
            var bind = MochiKit.Base.bind;
            widget.changeValueCB = bind(this._onChangeValue, this, widget);
            widget.addValueCB = bind(this._onAddValue, this, widget);
            widget.selectValueCB = bind(this._onSelectValue, this, widget);
            widget.enterPressCB = bind(this._onEnterPress, this, widget);
            widget.clickRowButtonCB = bind(this._onClickRowButton, this, widget);
        }
    },
    
    _onParamHasDupValue: function(param, value) {
        var widget = this._findWidget(param);
        var displayText = this._getDisplayText(param, value); // Making sure we put up warning when either value or display value is in the panel ie) 1 or '1 - one'
        if(widget) {
            for(var i = 0 ; i < widget.getNumValues(); i++) {
                var widgetValue = widget.getValueAt(i);
                if(displayText == widgetValue) {
                    widget.setWarning(i, {code : bobj.crv.params.Validator.ValueStatus.VALUE_DUPLICATE, message : L_bobj_crv_ParamsDuplicateValue });
                }
            }
        }
    },
        
    /*
     *  Removes warning signs associated with Duplicate-value error
     *  if no value is provided, this function will clear all 'VALUE_DUPLICATE' errors
     */
    _onParamHasNoDupValue: function(param, value) {
        var widget = this._findWidget(param);
        var displayText = this._getDisplayText(param, value); // Making sure we put up warning when either value or display value is in the panel ie) 1 or '1 - one'

        var duplicateCode = bobj.crv.params.Validator.ValueStatus.VALUE_DUPLICATE;
        if(widget) {
            for(var i = 0 ; i < widget.getNumValues(); i++) {
                var widgetValue = widget.getValueAt(i);
                if((arguments.length == 1 || displayText == widgetValue) && widget.getWarning(i) != null && widget.getWarning(i).code == duplicateCode) {
                    widget.setWarning(i, null);
                }
            }
        }       
        
    },
    
    /**
     * Private ParameterUI callback. Updates the UI when a param value is edited.
     *
     * @param widget    [ParameterUI] The source of the event
     * @param valueIdx  [int]         The index of the value that changed
     * @param new Value [String]      The new value (display text) at valueIdx 
     */
    _onChangeValue: function(widget, valueIdx, newValue) { 
    	if (this._disablePanel) {
    	    return;
    	}
        widget.setWarning(valueIdx, null);
        var isDirty = widget.isDirty();
        this._panel.setDirty(this._panel.getIndex(widget), isDirty);
        this._updateToolbar();
    },
    
    /**
     * Private ParameterUI callback. Updates the UI when a new param value is 
     * added.
     *
     * @param widget    [ParameterUI] The source of the event
     * @param new Value [String]      The new value (display text)  
     */
    _onAddValue: function(widget, newValue) { 
    	if (this._disablePanel) {
    	    return;
    	}
        this._updateToolbar();
        this._panel.setDirty(this._panel.getIndex(widget), widget.isDirty());
    },
    
    /**
     * Private ParameterUI callback. Updates the UI when a param value is 
     * selected.
     *
     * @param widget    [ParameterUI] The source of the event
     * @param valueIdx  [int]         The index of the value that received focus  
     */
    _onSelectValue: function(widget, valueIdx) {
        var lastWidget = this._selected;
        var lastValueIdx = this._selectedValueIdx;
        
        this._select(widget, valueIdx);
        
        if (lastWidget && bobj.isNumber(lastValueIdx)) {
            this._checkAndSetValue(lastWidget, lastValueIdx);
        }
    },
    
    /**
     * Private ParameterUI callback. Attempts to apply change param values to 
     * the report when the Enter key is pressed while editing a value. 
     *
     * @param widget    [ParameterUI] The source of the event
     * @param valueIdx  [int]         The index of the value that has focus  
     */
    _onEnterPress: function(widget, valueIdx) {
        this._applyValues();
    },
    
    /**
     * Private ParameterUI callback. Shows a calendar picker when the button  
     * next to a parameter value is clicked.
     *
     * @param widget    [ParameterUI] The source of the event
     * @param valueIdx  [int]         The index of the value 
     * @param x         [int]         The absolute horizontal position of the event
     * @param y         [int]         The absolute vertical position of the event
     */
    _onClickRowButton: function(widget, valueIdx, x, y) {
        this._setConnectedToCalendar(true);
        var calendar = bobj.crv.Calendar.getInstance();
        
        var param = this._findParam(widget); 
        var format = this._getDateTimeFormat(param.valueDataType);
        
        var date = bobj.external.date.getDateFromFormat(widget.getValueAt(widget.getSelectedIndex()), format);
        if (date) { 
            calendar.setDate(date);    
        }
        
        calendar.setShowTime(param.valueDataType === bobj.crv.params.DataTypes.DATE_TIME);
        calendar.show(true, x, y);
    },
    
    /**
     * Private Calendar callback. Updates display text after a date is picked
     * from the calendar picker.
     *
     * @param date [Date]  The date that should be displayed  
     */
    _onClickCalendarOKButton: function(date) {
        this._setConnectedToCalendar(false);
        if (date && this._selected) { 
            var param = this._findParam(this._selected);
            var valueIdx = this._selected.getSelectedIndex();
            
            var format = this._getDateTimeFormat(param.valueDataType);
            var strValue = bobj.external.date.formatDate(date, format);
            this._selected.setValueAt(valueIdx, strValue);
            
            var isDirty = this._selected.isDirty();
            this._selected.setWarning(valueIdx, null);
            this._panel.setDirty(this._panel.getIndex(this._selected), isDirty);
            this._updateToolbar();
        }
    },
    
    /**
     * Private Calendar callback. Stops listening to calendar widget events when the
     * calendar is dismissed with the cancel button.  
     */
    _onClickCalendarCancelButton: function() {
        this._setConnectedToCalendar(false);
    },
    
    _onHideCalendar : function() {
        this._setConnectedToCalendar(false);
    },
    
    /**
     * Private ParameterPanel callback. Applies changed parameter values to the
     * report when the run button is clicked on the panel's toolbar.
     */
    _onClickTbApplyButton: function() {
        this._applyValues();
    },
    
    /**
     * Private ParameterPanel callback. Shows the advanced dialog for the 
     * selected parameter when the advanced dialog button is clicked on the 
     * panel's toolbar.
     */
    _onClickTbAdvButton: function() {
        if (this._selected) {
            this._viewerCtrl.showAdvancedParamDialog(this);
        }
    },
    
    /**
     * Private ParameterPanel callback. Deletes the selected parameter value 
     * when the delete button is clicked on the panel's toolbar.
     */
    _onClickTbDeleteButton: function() {
        if (this._selected) {
            var index = this._selected.getSelectedIndex();
            this._selected.deleteValue(index);
            
            this._panel.setDirty(this._panel.getIndex(this._selected), this._selected.isDirty());
            this._updateToolbar();
            
            var param = this._findParam(this._selected);
            param.removeValueAt(index);
            
            index = Math.min(index, this._selected.getNumValues() - 1);
            this._selected.setSelected(index);
            
            if((param.isOptionalPrompt || param.allowNullValue) && param.getValue().length == 0) {
                this._selected.showRowCreater(true);
            }            
        }
    },
    
    /**
     * Private. Selects a parameter value.
     * 
     * @param widget   [Widget] The ParameterUI to select
     * @param valueIdx [int]    The index of the value to select
     */
    _select: function(widget, valueIdx) {
        this._selectedValueIdx = valueIdx;
        
        if (this._selected !== widget) {
            if (this._selected) {
                this._selected.deselect();
            }
            this._selected = widget;
                        
            this._panel.setSelected(this._panel.getIndex(widget), true);
            this._updateToolbar();
        }
        
        if (bobj.isNumber(valueIdx)) {
            this._selected.setSelected(valueIdx);    
        }
    },
    
    /**
     * Private. Attempts to apply changed parameter values to the report.
     * Changed display text will be converted to parameter values and validated.
     * Validation failure will cause a warning to appear instead of updating the
     * report.
     */
    _applyValues: function() {
        this._checkAndSetValue(this._selected, this._selectedValueIdx);
        
        var numParams = this._paramList.length;
        var badParamIdx = -1;
        var badValueIdx = -1;
        var warning = null;
        var paramUI = null;
        
        for (var i = 0; (i < numParams) && !warning; ++i) {
            paramUI = this._panel.getParameter(i);
            var numValues = paramUI.getNumValues();
            for (var j = 0; (j < numValues) && !warning; ++j) {
                warning = paramUI.getWarning(j);
                if (warning) {
                    badParamIdx = i;
                    badValueIdx = j;
                }
            }
        }
        
        if (warning) {
            paramUI = this._panel.getParameter(badParamIdx);
            this._onSelectValue(paramUI, badValueIdx);
            
            var dlg = bobj.crv.ErrorDialog.getInstance();
            dlg.setText(warning.message, null);
            dlg.setTitle(L_bobj_crv_ParamsInvalidTitle);
            dlg.setPromptType(_promptDlgWarning);
            dlg.show(true, function(){paramUI.setSelected(badValueIdx);});
        }
        else {
            // make all value changes permanent
            for (var i = 0, c = this._paramList.length; i < c; i++) {
                this._paramList[i].commitValue();
            }
            this._viewerCtrl.applyParams(this._paramList);
        }
    },
    
    /**
     * Private. Finds the Parameter associated with a given ParameterUI.
     * 
     * @param widget [ParameterUI] 
     *
     * @return [Parameter] 
     */
    _findParam: function(widget) {
        return this._paramList[this._panel.getIndex(widget)];   
    },
    
    _findWidget: function(param) {
        for(var i = 0 ; i < this._paramList.length; i++) {
            if(this._paramList[i].paramName == param.paramName) {
                return this._panel.getParameter(i)
            }
        }
        return null;
    },
    
    /**
     * Private. Updates the state of the parameter panel's toolbar buttons. 
     */
    _updateToolbar: function() {
    	if (this._disablePanel) {
    	    return;
    	}
    	
        if (this._selected) {
            var param = this._findParam(this._selected); 
            this._panel.setDeleteButtonEnabled( this._canPanelChangeValues(param) && 
                 (((param.isOptionalPrompt || param.allowNullValue) && this._selected.getValues().length > 0) ||
                 (param.allowMultiValue && this._selected.getValues().length > 1)));
        }
        else {
            this._panel.setDeleteButtonEnabled(false);
        }
        
        var isPanelDirty = false;
        for(var i = 0, len = this._paramList.length; i < len; i++) {
            if(this._panel.isDirty(i)) {
                isPanelDirty = true;
                break;
            }
        }
        
        this._panel.setApplyButtonEnabled(isPanelDirty);
    },
    
    /**
     * Private. Selects a Date/Time format string from paramOpts based on the 
     * give parameter value type.
     *
     * @param dataType [bobj.crv.params.DataTypes]
     *
     * @return [String] Returns a DateTime format string.
     */
    _getDateTimeFormat: function(dataType) {
        var Type = bobj.crv.params.DataTypes;
        switch(dataType) {
            case Type.DATE: 
                return this._paramOpts.dateFormat;
            case Type.TIME: 
                return this._paramOpts.timeFormat;
            case Type.DATE_TIME: 
                return this._paramOpts.dateTimeFormat;
            default: return null;
        }
    },
    
    /**
     * Private. Connects or disconnects to/from Calendar widget events. A shared 
     * Calendar widget instance is used, so events should only be monitored 
     * when this controller has caused the Calendar to display.
     *
     * @param isConnected [bool] True causes Calendar events to be handled. 
     *                           False causes them to be ignored.
     */
    _setConnectedToCalendar: function(isConnected) {
        var op = isConnected ? MochiKit.Signal.connect : MochiKit.Signal.disconnect;
        var calendar = bobj.crv.Calendar.getInstance();
        op(calendar, calendar.Signals.OK_CLICK, this, '_onClickCalendarOKButton');
        op(calendar, calendar.Signals.CANCEL_CLICK, this, '_onClickCalendarCancelButton');
        op(calendar,  calendar.Signals.ON_HIDE, this, '_onHideCalendar');
    },
    
    /**
     * Private. Convert display text to a param value, validate it, and update
     * the value of the associated Parameter instance when validation succeeds.
     * Sets the warning text of the value when validation fails.
     *
     * @param widget   [ParameterUI]  
     * @param valueIdx [int] Index of value to validate and update
     */
    _checkAndSetValue: function(widget, valueIdx) {
        /*
         * Return if parameter value is modified in advanced dialog as the parameter value is already set by updateParameter
         */
        if(!widget.canChangeOnPanel) {
            return;
        }
        
        var parameter = this._findParam(widget);
        var valueText = widget.getValueAt(valueIdx); 
        
        // Checking if value exists in defaultValues and if it does, get the value from defaultValue
        var defValue = this._getValueTextFromDefValueDesc(parameter,valueText);
        if(defValue != null) {
                valueText = defValue;
        }

        var paramValue = this._getParamValue(parameter.valueDataType, valueText);
        
        // if the following condition is true, the user is providing 'no value' to an optional parameter
        if (valueIdx == 0 && paramValue == null && parameter.getValue().length == 0) {
            if(parameter.allowNullValue) {
                parameter.setValue(0, null);
            }
            
            if(parameter.isOptionalPrompt || parameter.allowNullValue) {
                return;
            }
        }
        
        var Status = bobj.crv.params.Validator.ValueStatus;
        var code = Status.OK;
        var warningMsg = null;
        
        code = bobj.crv.params.Validator.getInstance().validateValue(parameter, paramValue);
        
        if (Status.OK === code) {
            var cText = this._getValueTextFromDefaultValue(parameter,paramValue);
            if(cText != null) {
            	widget.setValueAt(valueIdx,cText);
            }        	
            widget.setWarning(valueIdx,null); // Removes warning
            parameter.setValue(valueIdx, paramValue); //checks for duplicates when setting a value

            
        }
        else {
            warningMsg = this._getWarningText(parameter, code);
            widget.setWarning(valueIdx, {code : code, message : warningMsg });
        }
        
    },
    
    /**
     * Private. Convert a validation error code into a readable warning message.
     *
     * @param param [Parameter]   Parameter that has the erroroneous value
     * @param code  [ValueStatus] Validation error code
     *
     * @return [String] Returns a warning message suitable for display in the UI
     */
    _getWarningText: function(param, code) { 
        var Type = bobj.crv.params.DataTypes;

            switch(param.valueDataType) {
                case Type.DATE:
                case Type.TIME:
                case Type.DATE_TIME:
                    return this._getDateTimeWarning(param,code);
                case Type.STRING:
                    return this._getStringWarning(param, code);
                case Type.NUMBER:
                case Type.CURRENCY:
                    return this._getNumberWarning(param,code);
                default:
                    return null;
            }   
    },

    /**
     * Private. Create warning message for invalid datetime value
     * @param param [Parameter]   Parameter that has the erroroneous value
     * @param code  [ValueStatus] Validation error code
     *
     * @return [String] Returns a warning message suitable for display in the UI
     */ 
    _getDateTimeWarning: function(param,code) {
        var dataTypes = bobj.crv.params.DataTypes;
        var ValueStatus = bobj.crv.params.Validator.ValueStatus;
        var dateFormat = this._paramOpts.dateFormat;
        
        dateFormat = dateFormat.replace('yyyy', '%1');
        dateFormat = dateFormat.replace('M', '%2');
        dateFormat = dateFormat.replace('d', '%3');   
        dateFormat = dateFormat.replace('%1', L_bobj_crv_ParamsYearToken);
        dateFormat = dateFormat.replace('%2', L_bobj_crv_ParamsMonthToken);
        dateFormat = dateFormat.replace('%3', L_bobj_crv_ParamsDayToken);        
        
        if(code == ValueStatus.ERROR || code == ValueStatus.VALUE_INVALID_TYPE) {
            switch(param.valueDataType) {
                case dataTypes.DATE:
                    return L_bobj_crv_ParamsBadDate.replace("%1",dateFormat);
                case dataTypes.DATE_TIME:
                    return L_bobj_crv_ParamsBadDateTime.replace("%1",dateFormat);
                    break;
                case dataTypes.TIME:
                    return L_bobj_crv_ParamsBadTime
                    break;     
            }
        }
        else if(code == ValueStatus.VALUE_TOO_BIG || code == ValueStatus.VALUE_TOO_SMALL){
            return this._getMinMaxText(param.valueDataType,param.minValue,param.maxValue);
        }
        
        return null;       
    },
    
    /**
     * Private. Create a warning message for String parameter 
     *
     * @param param [Parameter]   Parameter that has the erroroneous value
     * @param code  [ValueStatus] Validation error code
     *
     * @return [String] Returns a warning message suitable for display in the UI
     */ 
    _getStringWarning: function(param, code) {
        var Status = bobj.crv.params.Validator.ValueStatus;
        if (Status.VALUE_TOO_LONG === code) {
            return L_bobj_crv_ParamsTooLong.replace('%1', param.maxValue);
        }
        else if(Status.VALUE_TOO_SHORT === code){ 
            return L_bobj_crv_ParamsTooShort.replace('%1', param.minValue);
        }
        return null;
    },
    
    /**
     * Private. Create warning message for invalid datetime value
     * @param param [Parameter]   Parameter that has the erroroneous value
     * @param code  [ValueStatus] Validation error code
     *
     * @return [String] Returns a warning message suitable for display in the UI
     */   
     _getNumberWarning : function(param,code) {
        var ValueStatus = bobj.crv.params.Validator.ValueStatus;
        var dataTypes = bobj.crv.params.DataTypes;
        switch(code) {
            case ValueStatus.ERROR:
            case ValueStatus.VALUE_INVALID_TYPE:
                if(param.valueDataType == dataTypes.NUMBER) {
                    return L_bobj_crv_ParamsBadNumber;
                }
                else if(param.valueDataType == dataTypes.CURRENCY) {
                    return L_bobj_crv_ParamsBadCurrency;
                }    
            case ValueStatus.VALUE_TOO_BIG:
            case ValueStatus.VALUE_TOO_SMALL:
                return this._getMinMaxText(param.valueDataType,param.minValue,param.maxValue);
            default:
                return null;
        
        }
     }  
};
