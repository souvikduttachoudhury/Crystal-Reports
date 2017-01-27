
/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof bobj.crv.params.ParameterUI == 'undefined') {
    bobj.crv.params.ParameterUI = {};
    bobj.crv.params.ParameterValueRow = {};
    bobj.crv.params.ParamValueButton = {};
    bobj.crv.params.ParamRowCreator = {};
    bobj.crv.params.TextField = {};
    bobj.crv.params.TextCombo = {};
    bobj.crv.params.ScrollMenuWidget = {};
    bobj.crv.params.HelperRow = {};
}

/*
================================================================================
ParameterUI

Widget for displaying and editing parameter values. Contains one or many
ParameterValueRows and, optionally, UI that allows rows to be added.
================================================================================
*/
bobj.crv.params.newParameterUI = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        canChangeOnPanel: false,
        allowCustom: false,
        canAddValues: false,
        isPassword : false,
        valueRequired: true,
        isReadOnlyParam: true,
        values: [],
        defaultValues: null,
        hasRowButtons: false,
        rowButtonsUrl: null,
        width: '200px',
        changeValueCB: null,
        addValueCB: null,
        selectValueCB: null,
        enterPressCB: null,
        clickRowButtonCB: null,
        openAdvDialogCB: null,
        maxNumParameterDefaultValues: 200,
        tooltip : null
    }, kwArgs);
    
    var o = newWidget(kwArgs.id);
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.ParameterUI);
    
    o._selectedRow = null;
    o._createMenu();
    o._rows = [];
    o._numRowsChanged = false;
    return o;
};

/** 
 *  Creates single menubar for all parameter value rows of current param UI
 */
bobj.crv.params.ParameterUI._createMenu = function() {
    var dvLength = this.defaultValues.length;
    if(dvLength > 0 ) { 
        var kwArgs = {originalValues:  this.defaultValues};
        
        if (dvLength == this.maxNumParameterDefaultValues) {
            kwArgs.originalValues[this.maxNumParameterDefaultValues] = L_bobj_crv_ParamsMaxNumDefaultValues;
            MochiKit.Base.update(kwArgs, {
                openAdvDialogCB: this.openAdvDialogCB, 
                maxNumParameterDefaultValues: this.maxNumParameterDefaultValues
                }); 
        }
        
        this._defaultValuesMenu = bobj.crv.params.newScrollMenuWidget(kwArgs);
    }
    else {
        this._defaultValuesMenu = null;
    }
};

bobj.crv.params.ParameterUI.init = function() {
    Widget_init.call(this);
    
    var rows = this._rows;
    for(var i = 0, len = rows.length; i < len; ++i) {
        rows[i].init(); 
    }
    
    if (this._rowCreator) {
        this._rowCreator.init();
    }
    if(this._helperRow) {
        this._helperRow.init();
    }
};

bobj.crv.params.ParameterUI.getHTML = function() {
    var rowsHtml = '';

    var values = this.values;
    var rows = this._rows;
    for (var i = 0, len = values.length; i < len; ++i) {
        rows.push(this._getRow(values[i], this._getBgColor(i)));
        rowsHtml += rows[i].getHTML();
    }

    
    var rowCreatorHtml = '';
    if (this._canAddRowCreater()) {
        this._rowCreator = this._getRowCreator();
        rowCreatorHtml = this._rowCreator.getHTML();
    }
    
    var helperRowHtml = '';
    if(this._canAddHelperRow()) {
        this._helperRow =  bobj.crv.params.newHelperRow({message : L_bobj_crv_ParamsNoValue}); 
        helperRowHtml = this._helperRow.getHTML();
    }
    
    return bobj.html.DIV({id: this.id, style:{width:bobj.unitValue(this.width)}}, 
        rowsHtml,helperRowHtml,rowCreatorHtml);  
};

bobj.crv.params.ParameterUI._canAddRowCreater = function() {
    return (this.canAddValues || (!this.valueRequired && this.values.length === 0 && !this.isReadOnlyParam));
};

bobj.crv.params.ParameterUI._canAddHelperRow = function() {
    return (this.isReadOnlyParam && this.values.length === 0 );  
};

bobj.crv.params.ParameterUI._getRow = function(value, color) {
    var Colors = bobj.crv.params.BackgroundColor;
    
    var row = bobj.crv.params.newParameterValueRow ({
        value: value,
        defaultValues: this.defaultValues,
        width: this.width, 
        bgColor: color,
        isReadOnlyParam: this.isReadOnlyParam,
        canChangeOnPanel: this.canChangeOnPanel,
        allowCustom: this.allowCustom,
        isPassword: this.isPassword,
        hasButton: this.hasRowButtons, 
        buttonUrl: this.rowButtonsUrl,
        openAdvDialogCB: this.openAdvDialogCB,
        defaultValuesMenu : this._defaultValuesMenu,
        tooltip : this.tooltip
    });
    
    var bind = MochiKit.Base.bind;
    
    row.changeCB = bind(this._onChangeValue, this, row); 
    row.selectCB = bind(this._onSelectValue, this, row);
    row.enterCB = bind(this._onEnterValue, this, row);
    row.buttonClickCB = bind(this._onClickRowButton, this, row);
    
    return row;
};

bobj.crv.params.ParameterUI._addRow = function(value) {
    var row = this._getRow(value, this._getBgColor(this._rows.length));
    this._rows.push(row);
    this._numRowsChanged = true;
    if (this._rowCreator) {
        this._rowCreator.setBgColor(this._getBgColor(this._rows.length));
        insBefore2(this._rowCreator.layer, row.getHTML());
        row._valueWidget.setAlwaysDirty ();
    }
    else {
        append(this.layer, row.getHTML());
    }
    row.init();  
    row.setBgColor();
    return row;
};

bobj.crv.params.ParameterUI._onChangeValue = function(row) {
    if (this.changeValueCB) {
        this.changeValueCB(this._getRowIndex(row), row.getValue());
    }
};

bobj.crv.params.ParameterUI._onSelectValue = function(row) {
    if (this._selectedRow !== row) {
        this.deselect();
        this._selectedRow = row;
    }
    if (this.selectValueCB) {
        this.selectValueCB(this._getRowIndex(row));
    }
};

bobj.crv.params.ParameterUI._onEnterValue = function(row) { 
    if (this.enterPressCB) {
        this.enterPressCB(this._getRowIndex(row));
    }
};

bobj.crv.params.ParameterUI._onClickRowButton = function(row, x, y) { 
    if (this.clickRowButtonCB) {
        this.clickRowButtonCB(this._getRowIndex(row), x, y);
    }
};

bobj.crv.params.ParameterUI.showRowCreater =function(show) {
    if(!this._rowCreator && show) {
        this._rowCreator = this._getRowCreator();    
         append(this.layer, this._rowCreator.getHTML());
         this._rowCreator.init();     
    } 
    if(this._rowCreator) {   
        this._rowCreator.show(show);
    }
};

bobj.crv.params.ParameterUI.showHelperRow = function(show) {
    if(!this._helperRow && show) {
        this._helperRow = bobj.crv.params.newHelperRow({message : L_bobj_crv_ParamsNoValue});    
         if(this._rowCreator) {
            insBefore2(this._rowCreator.layer, this._helperRow.getHTML());
         }
         else {
            append(this.layer, this._helperRow.getHTML());
         }
         this._helperRow.init();     
    } 
    if(this._helperRow) {   
        this._helperRow.show(show);
    }
};

bobj.crv.params.ParameterUI._onCreateRow = function() {
    if((!this.canChangeOnPanel) && (!this.isReadOnlyParam)) {
    // TODO this is not reachable
        this.selectValueCB(-1);
        this.openAdvDialogCB();
    }
    else {
        var val = '';
        if (!this.allowCustom && this.defaultValues.length > 0) {
            val = this.defaultValues[0];
        }
        
        var row = this._addRow(val);
        this.setSelected(this._rows.length - 1);
        this._onSelectValue(row);
        
        if (this.addValueCB) {
            this.addValueCB(row.getValue());    
        }
        // if parameter is single value and optional, remove row creater
        if(!this.canAddValues && !this.valueRequired) {
            this.showRowCreater(false);
        }
   }

};

bobj.crv.params.ParameterUI._getRowIndex = function(row) {
    if (row) {
        var rows = this._rows;
        for (var i = 0, len = rows.length; i < len; ++i) {
            if (rows[i] === row) {
                return i;
            }
        }
    }
    return -1;
};

bobj.crv.params.ParameterUI._getRowCreator = function() {
    var cb = MochiKit.Base.bind(this._onCreateRow, this);
    return bobj.crv.params.newParamRowCreator({activateCB: cb});
};

bobj.crv.params.ParameterUI._getBgColor = function(index) {
    var Colors = bobj.crv.params.BackgroundColor;
    
    var dirty = false;
    if (this._rows.length > index) {
        dirty = this._rows[index].isDirty();
    }
    
    if (dirty){
        if (index % 2) {
            return Colors.dirtyAlternate;
        }
        else {
            return Colors.dirty;
        }
    } else
    {
        if (index % 2) {
            return Colors.alternate;
        }
        else {
            return Colors.standard;
        }
    }
    
    return Colors.standard;
};

bobj.crv.params.ParameterUI.isDirty = function() {
    if (this._numRowsChanged) {
        return true;    
    }
    for (var i = 0, len = this._rows.length; i < len; ++i) {
        if (this._rows[i].isDirty()) {
            return true;    
        }
    }
    return false;
};

bobj.crv.params.ParameterUI.getNumValues = function() {
    return this._rows.length;    
};

bobj.crv.params.ParameterUI.getValueAt = function(index) {
    var row = this._rows[index];
    if (row) {
        return row.getValue();    
    }
    return null;
};

bobj.crv.params.ParameterUI.getValues = function() {
    var values = [];
    for (var i = 0, len = this._rows.length; i < len; ++i) {
        values.push(this._rows[i].getValue());
    }
    return values;
};

bobj.crv.params.ParameterUI.getSelectedIndex = function() {
    return this._getRowIndex(this._selectedRow); 
};

bobj.crv.params.ParameterUI.setValueAt = function(index, value) {
    var row = this._rows[index];
    if (row) {
        row.setValue(value);    
    }
};

bobj.crv.params.ParameterUI.setValues = function(values) {
    if (!values) {return;}
    var valuesLen = values.length;
    var rowsLen = this._rows.length;    
    // TODO Post Titan, Justin: We could get fancier here for multi value
    // parameters so that we keep the rows that are unchanged.
    for (var i = 0; i < valuesLen && i < rowsLen; ++i) { 
        this._rows[i].setValue(values[i]);
    }
    
    if (rowsLen > valuesLen) { 
        for (var i = rowsLen - 1; i >= valuesLen; --i) {
            // delete from the end to minimize calls to setBgColor
            this.deleteValue(i); 
        }
    }
    else if (valuesLen > rowsLen) { 
        for (var i = rowsLen; i < valuesLen; ++i) { 
            this._addRow( values[i] );
            this._rows[i]._valueWidget.setAlwaysDirty ();
        }
    }
};

bobj.crv.params.ParameterUI.setCleanValue = function(index, value) {
    var row = this._rows[index];
    if (row) {
        row.setCleanValue(value);    
    }
};

bobj.crv.params.ParameterUI.setBgColor = function () {
    var rowsLen = this._rows.length;
    for (var i = 0; i < rowsLen; ++i) {
        this._rows[i].setBgColor(this._getBgColor(i));
    }
}

bobj.crv.params.ParameterUI.deleteValue = function(index) { 
    if (index >= 0 && index < this._rows.length) { 
        var row = this._rows[index];
        row.layer.parentNode.removeChild(row.layer);
        _widgets[row.widx] = null;
        
        this._rows.splice(index, 1);
        this._numRowsChanged = true;
        
        var rowsLen = this._rows.length;
        for (var i = index; i < rowsLen; ++i) { 
            this._rows[i].setBgColor(this._getBgColor(i));  
        }
        
        if (this._rowCreator) {
            this._rowCreator.setBgColor(this._getBgColor(rowsLen));  
        }
    }
};

bobj.crv.params.ParameterUI.setWarning = function(index, warning) {
    var row = this._rows[index];
    if (row) {
        row.setWarning(warning);    
    }
};

bobj.crv.params.ParameterUI.getWarning = function(index) {
    var row = this._rows[index];
    if (row) {
        return row.getWarning();    
    }
};

bobj.crv.params.ParameterUI.setSelected = function(index) { 
    var row = this._rows[index];
    if (row && this._selectedRow != row) {
        if(this._getRowIndex(this._selectedRow) != -1) {
            this.deselect(); // deselect only if the selected row is not removed from rows list
        }  
        this._selectedRow = row;
        row.select();
    }    
};

bobj.crv.params.ParameterUI.deselect = function() {
    if (this._selectedRow) {
        this._selectedRow.deselect();
        this._selectedRow = null;
    }
};

bobj.crv.params.ParameterUI.resize = function(w) {
    if (w !== null) {
        this.width = w;
        if (this.layer) {
            bobj.setOuterSize(this.layer, w);
        }
    }
};

/*
================================================================================
BackgroundColor

Enum for parameter value row background colors
================================================================================
*/

bobj.crv.params.BackgroundColor = {
    standard: 0,
    dirty: 1,
    alternate: 2,
    dirtyAlternate: 3
};

/*
================================================================================
ParameterValueRow

Internal class for use by ParameterUI. Darws a UI for a single parameter value. 
================================================================================
*/

// these are the Y offsets of the icons in the param_panel.gif image
bobj.crv.paramPanelIcon = bobj.crvUri('images/param_panel.gif');

bobj.crv.paramWarningIconYOffset = 0; // param_warning.gif
bobj.crv.paramAdvIconYOffset = 124; //param_adv.gif

bobj.crv.params.newParameterValueRow = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        value: '',
        defaultValues: null,
        bgColor: bobj.crv.params.BackgroundColor.standard,
        isReadOnlyParam: true,
        canChangeOnPanel: false,
        allowCustom: false,
        isPassword: false,
        hasButton: false, 
        buttonUrl: null,
        changeCB: null,
        selectCB: null,
        enterCB: null,
        buttonClickCB: null,
        openAdvDialogCB: null,
        defaultValuesMenu: null,
        tooltip : null
    }, kwArgs);

    var o = newWidget(kwArgs.id);   
    o.widgetType = 'ParameterValueRow';
    o._prevValueString = kwArgs.value;
    o._warning = null;
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs); 
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.ParameterValueRow);
    
    return o;
};

bobj.crv.params.ParameterValueRow.init = function() {
    Widget_init.call(this);    
    this._valueWidget.init();
    if (this._button) {
        this._button.init();
    }
    
    this._valueCtn = getLayer(this.id + '_vc');
    this._rightCtn = getLayer(this.id + '_rc');  
    this._icon = this._rightCtn.firstChild;
    this._btnCtn = getLayer(this.id + '_bc');
    this._valBtnCtn = getLayer(this.id + '_vab');
    
    this._advBtnCtn = getLayer(this.id + '_adv_ctn');
    if (this._advButton) {
        this._advButton.init();
    }

    if (MochiKit.Base.isIE()) {
        // IE's 100% is different than other browsers, even in standards compliant mode....
        var marg = parseInt(MochiKit.Style.computedStyle(this._valueCtn, 'margin-right'), 10);
        if (bobj.isNumber(marg)) {
            this._valueWidget.layer.style.marginRight = (-1 * marg) + 'px';
        }
    }
    
    this.layer.onmousedown = MochiKit.Base.bind(this._onMouseDown, this);
};

bobj.crv.params.ParameterValueRow.getHTML = function() {
    if (!this._valueWidget) {
        this._valueWidget = this._getValueWidget();    
    }
    if (this.hasButton && !this._button) {
        var clickCB = MochiKit.Base.bind(this._onButtonClick, this);
        this._button = bobj.crv.params.newParamValueButton({url: this.buttonUrl, clickCB: clickCB});
    }
    
    var DIV = bobj.html.DIV;
    var IMG = bobj.html.IMG;
    
    var cssClass = this._getBgColorClass(this.bgColor) + ' iactParamRow';
    if (MochiKit.Base.isIE() && bobj.isQuirksMode()) {
        cssClass += ' ' + 'iactParamRowIE';
    }
    
    return DIV({id: this.id, 'class': cssClass}, 
        this.hasButton ? this._getValueAndButtonHTML() : this._getValueHTML(), 
        DIV({id: this.id+'_rc', 'class': 'iactParamRight'}, 
            imgOffset(bobj.crv.paramPanelIcon,16,16,0,bobj.crv.paramWarningIconYOffset,this.id + '_icn',
                 'class="iactParamValueWarningIcon"','','display:none',''),this._getAdvButtonHTML ()));				
};

bobj.crv.params.ParameterValueRow._getAdvButtonHTML = function () {
        this._advButton = bobj.crv.params.newParamValueButton ({
        id: this.id + '_adv_icn',
        url: bobj.crv.paramPanelIcon,
        clickCB: this.openAdvDialogCB,
        tooltip: L_bobj_crv_ParamsAdvDlg,		
        dx:0,
        dy:bobj.crv.paramAdvIconYOffset});

    var DIV = bobj.html.DIV;
    return DIV({id:this.id + "_adv_ctn", style:{display:"none", position:"absolute", right:"0", top:"0", cursor:_hand}},
            this._advButton.getHTML());
};

/**
 * @return [String] Returns HTML for the the value
 */
bobj.crv.params.ParameterValueRow._getValueHTML = function() {
    var DIV = bobj.html.DIV;
    var style = {};
    
    if(MochiKit.Base.isIE() && bobj.isQuirksMode()) {
        style.position = "absolute";
        style.top = "0px";
        style.left= "0px";
    }
    
    return DIV({id: this.id + '_vc', 'class': 'iactParamValue', style: style}, this._valueWidget.getHTML());
};

/**
 * @return [String] Returns HTML for the value and a button beside it
 */
bobj.crv.params.ParameterValueRow._getValueAndButtonHTML = function() {
    var style = {};
    if (MochiKit.Base.isIE() && bobj.isQuirksMode()) {
        style.width = '100%';
    }
    
    var DIV = bobj.html.DIV;
    
    var html = DIV({id: this.id + "_vab", style: style, 'class': "iactParamValueAndButton"}, 
        this._getValueHTML(),
        DIV({id:this.id + "_bc", 'class':"iactValueIcon", style:{position:"absolute", right:"0", top:"0", cursor:_hand}},
            this._button.getHTML()));
            
    return html;            
};

/**
 * Creates a widget to display/edit the value. 
 * 
 * @return [Widget]
 */
bobj.crv.params.ParameterValueRow._getValueWidget = function() {
    var showDefVals = this.defaultValuesMenu !== null && !this.isReadOnlyParam && this.canChangeOnPanel;
    var typeCons = showDefVals ? 'newTextCombo' : 'newTextField'; 
    
    var bind = MochiKit.Base.bind;
    
    var widget = bobj.crv.params[typeCons]({
        password: this.isPassword,
        cleanValue: this.value,
        editable: this.allowCustom && this.canChangeOnPanel,
        enterCB: bind(this._onEnterPress, this),
        keyUpCB: bind(this._onKeyUp, this),
        bgColor: this.bgColor,
        tooltip : this.tooltip
    });  
    
    if(showDefVals) {
        widget.setMenu(this.defaultValuesMenu);
        widget.changeCB = bind(this._onChange, this);
    }
    
    return widget;
};

bobj.crv.params.ParameterValueRow.getValue = function() {
    if (this._valueWidget) {
        return this._valueWidget.getValue();    
    }
    return this.value;
};

bobj.crv.params.ParameterValueRow.setValue = function(value) {
    if (this._valueWidget) {
        this._valueWidget.setValue(value);    
    }
};

bobj.crv.params.ParameterValueRow.setCleanValue = function(value) {
    if (this._valueWidget) {
        this._valueWidget.setCleanValue(value);    
    }
};

/**
 * Set keyboard focus to the widget and mark it as selected
 */
bobj.crv.params.ParameterValueRow.select =
bobj.crv.params.ParameterValueRow.focus = function() {
    this._select(true);
    
    if(this._valueWidget.widgetType == "TextCombo") {
      this._valueWidget.text.focus();  
    }
    else {
        this._valueWidget.focus();
    }
};

/**
 * Check if the widget is selected
 *
 * @return [boolean] True iff the widget is selected.
 */
bobj.crv.params.ParameterValueRow.isSelected = function() { 
    return this._isSelected; 
};

/**
 * Deselects this parameter widget.
 */
bobj.crv.params.ParameterValueRow.deselect = function() { 
    this._select(false); 
};

/**
 * Displays a thick border around the widget when it is selected.
 *
 * @param select [boolean]  Border is displayed when true
 *
 */
bobj.crv.params.ParameterValueRow._select = function(select) { 
    this._isSelected = select ? true : false;
    if (select) {
        var addClass = MochiKit.DOM.addElementClass;
        addClass(this._rightCtn, 'iactParamRightSel');
        addClass(this.layer, 'iactParamRowSel');
        if (this._valBtnCtn) { 
            addClass(this._valBtnCtn, 'iactParamValueAndButtonSel');
        }
        else {
            addClass(this._valueCtn, 'iactParamValueSel');
        }
    }
    else {
        var removeClass = MochiKit.DOM.removeElementClass;
        removeClass(this._rightCtn, 'iactParamRightSel');
        removeClass(this.layer, 'iactParamRowSel');
        if (this._valBtnCtn) {
            removeClass(this._valBtnCtn, 'iactParamValueAndButtonSel');
        }
        else {
            removeClass(this._valueCtn, 'iactParamValueSel');            
        }
    }
    if(this._valueWidget && this._valueWidget.setSelected) {
       this._valueWidget.setSelected(select);
    }
    this._showAdvButton (select);
};

/**
 * Shows (or hides) the adv button icon
 */
bobj.crv.params.ParameterValueRow._showAdvButton = function(visible) {
    if (this.isReadOnlyParam) {return;}

    if (visible === true) {
        this._advBtnCtn.style.display = '';
    }
    else {
        this._advBtnCtn.style.display = 'none';
    }
};

/**
 * Display a warning icon with a tooltip message
 *
 * @param warning [String] Tooltip message. If null, warning is hidden.
 */
bobj.crv.params.ParameterValueRow.setWarning = function(warning) {
    if (warning) {
        bobj.crv.Tooltip.setElementTooltip(this._icon, warning.message);
        this._icon.style.display = '';
    }
    else {
        this._icon.style.display = 'none';
    }
    
    this._warning = warning;
};

bobj.crv.params.ParameterValueRow.getWarning = function() {
    return this._warning;
};

/**
 * Change the outer dimensions of the widget 
 *
 * @param w [int, optional] Width in pixels
 * @param h [int, optional] Height in pixels
 */
bobj.crv.params.ParameterValueRow.resize = function(w, h) {
    bobj.setOuterSize(this.layer, w, h);
};

/**
 * Check if the parameter value has been changed
 *
 * @return [boolean] True iff the value has been changed using the UI
 */
bobj.crv.params.ParameterValueRow.isDirty = function() { 
    return this._valueWidget.isDirty(); 
};

/**
 * Set the background color 
 *
 * @param color [int] BackgroundColor enum member
 */
bobj.crv.params.ParameterValueRow.setBgColor = function(color) { 
    if (color !== this.bgColor) {  
        if (this.layer) {
            var DOM = MochiKit.DOM;
            DOM.removeElementClass(this.layer, this._getBgColorClass(this.bgColor));
            DOM.addElementClass(this.layer, this._getBgColorClass(color));
        }
        this.bgColor = color;
        this._valueWidget.setBgColor(color);
    }
};

/**
 * @return [String] returns the css class for a background color
 */
bobj.crv.params.ParameterValueRow._getBgColorClass = function(color) {
    var className = 'iactParamRowBg';
    var Colors = bobj.crv.params.BackgroundColor;
    if (color === Colors.alternate || color === Colors.dirtyAlternate) {
        className += 'Alt';
    }
    if (color === Colors.dirty || color === Colors.dirtyAlternate) {
        className += 'Dirty';
    }
    return className;
};

/**
 * Delete the current value 
 */
bobj.crv.params.ParameterValueRow.deleteValue = function() {
    this._valueWidget.setValue('', true); 
};

/**
 * Handles events that cause this prompt to be selected.
 */
bobj.crv.params.ParameterValueRow._onSelect = function() {
    var wasSelected = this.isSelected();
    if (!wasSelected && this.selectCB) {  
        this.selectCB();
    }
    this._select(true);
};

/**
 * Handle keyUp events when editing values or using keyboard navigation.
 *
 * @param e [keyup event]
 */
bobj.crv.params.ParameterValueRow._onKeyUp = function(e) {  
    
    var event = new MochiKit.Signal.Event(src, e);
    var key = event.key().string; 
    var newValueString = this._valueWidget.getValue();
    
    switch (key) {
        case "KEY_ESCAPE":
            this._valueWidget.setValue(this._valueWidget.cleanValue);
            if (this.changeCB) { 
                this.changeCB();    
            }
            this._onSelect(); 
            break;
            
        case "KEY_ARROW_LEFT":
        case "KEY_ARROW_RIGHT":
        case "KEY_HOME": 
        case "KEY_END":
        case "KEY_TAB":
            this._onSelect(); 
            break;
            
        default:
            if (newValueString !== this._prevValueString) {
                this._onSelect();  
                if (this.changeCB) { 
                    this.changeCB();    
                }
                this._prevValueString = newValueString;
            }
            break;
    }
};

bobj.crv.params.ParameterValueRow._onChange = function() {
    if (this.changeCB) { 
        this.changeCB();    
    }
};

/**
 * Handles Enter key press events.
 */
bobj.crv.params.ParameterValueRow._onEnterPress = function() {  
    if (this.isSelected() && this.enterCB) { 
        this.enterCB();
    }
    else {
        this._onSelect(); 
    }
};

/**
 * Selects this prompt when it's clicked.
 */
bobj.crv.params.ParameterValueRow._onMouseDown = function() {
    this._onSelect();
};

bobj.crv.params.ParameterValueRow._onButtonClick = function() {
    if (this.buttonClickCB) {
        var absPos = getPosScrolled(this._button.layer);
        var x = absPos.x + this._button.getWidth();
        var y = absPos.y + this._button.getHeight() + 1;
        this.buttonClickCB(x, y);
    }
};
/*
================================================================================
ParamValueButton

Internal class. Button that fits inline with parameter values
================================================================================
*/

bobj.crv.params.newParamValueButton = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        url: null,
        clickCB: null,
        tooltip: this.tooltip,
        dx:0,
        dy:0
    }, kwArgs);
    
    var o = newIconWidget(
        kwArgs.id,
        kwArgs.url,
        kwArgs.clickCB, 
        null,
        kwArgs.tooltip,
        14,14,kwArgs.dx,kwArgs.dy,0,0); 
        
    o.margin = 0;
    o.oldInit = o.init;
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.ParamValueButton);
    
    return o;
};

bobj.crv.params.ParamValueButton.init = function() {
    this.oldInit();

    this.layer.onfocus = IconWidget_realOverCB;
    this.layer.onblur = IconWidget_realOutCB;
};

bobj.crv.params.ParamValueButton.getHTML = function() {
    var imgCode;
    var h = bobj.html;
    if(this.src) {
        imgCode = h.DIV({style: {overflow: 'hidden', height: '16px', width : this.w + 'px'}}, 
                        simpleImgOffset(this.src,
                                        this.w,
                                        this.h,
                                        this.dis ? this.disDx: this.dx,
                                        this.dis ? this.dixDy: this.dy,
                                        'IconImg_' + this.id,
                                        null, //att
                                        this.alt,
                                        'cursor:'+ _hand),
                       this.extraHTML);
    }
    else {
        imgCode = h.DIV({'class' : 'icontext',
                         'style' : {width : '1px',height: (this.h + this.border) + 'px'}
                  });    
    }
    
    var divStyle = {margin: this.margin + 'px',
                    padding : '1px'};
    
    if(this.width) {
        divStyle.width = this.width + 'px';
    }                  
    if(!this.disp) {
        divStyle.display = 'none';
    } 
    
    return h.DIV({style : divStyle,
    			  id : this.id,
    			  'class' : this.nocheckClass
    			 },
    			 (this.clickCB && _ie)? lnk(imgCode, null, null, null, ' tabIndex="-1"' ) : imgCode 
    			 );

};

/*
================================================================================
ParamRowCreator

Internal class. UI for adding new values to a multi value parameter
================================================================================
*/
bobj.crv.params.newParamRowCreator = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        bgColor: null, 
        activateCB : null
    }, kwArgs);

    var o = newWidget(kwArgs.id);    
    o.widgetType = 'ParamRowCreator';
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.ParamRowCreator);
    
    o._textField = o._createTextField();
    
    return o;
};

bobj.crv.params.ParamRowCreator.init = function() {
    Widget_init.call(this);
    this._textField.init();    
    this.layer.onclick = MochiKit.Base.bind(this._onClick, this);
};

bobj.crv.params.ParamRowCreator.show = function(show) {
    if (show === false) {
        this.css.visibility = "hidden";
        this.css.display = "none";
    }
    else {
        this.css.visibility = "visible";
        this.css.display = "block";
    }
};


bobj.crv.params.ParamRowCreator.getHTML = function() {
    var DIV = bobj.html.DIV;
    
    cssClass = this._getBgColorClass() + ' iactParamRow';
    ieCssClass = 'iactParamRowIE';
    
    var valStyle = '';
    if (MochiKit.Base.isIE() && bobj.isQuirksMode()) {
        cssClass += ' ' + ieCssClass;
        valStyle.width = '100%';
    }
    
    
    return DIV({id: this.id, 'class': cssClass},
        DIV({'class': 'iactParamValue', style: valStyle}, this._textField.getHTML()),
        DIV({'class': 'iactParamRight'}));
};

bobj.crv.params.ParamRowCreator._getBgColorClass = bobj.crv.params.ParameterValueRow._getBgColorClass;

bobj.crv.params.ParamRowCreator.setBgColor = function(color) {
    if (color !== this.bgColor) {  
        if (this.layer) {
            MochiKit.DOM.removeElementClass(this.layer, this._getBgColorClass(this.bgColor));
            MochiKit.DOM.addElementClass(this.layer, this._getBgColorClass(color));
        }
        this.bgColor = color;
        this._textField.setBgColor(color);
    }
};

bobj.crv.params.ParamRowCreator._createTextField = function() {
    var text = bobj.crv.params.newTextField({
        cleanValue: L_bobj_crv_ParamsAddValue,  
        editable: false,
        enterCB: MochiKit.Base.bind(this._onEnterPress, this)
    });     
    return text;
};

bobj.crv.params.ParamRowCreator._onEnterPress = function() { 
    if (this.activateCB) { 
        this.activateCB();
    }
};

bobj.crv.params.ParamRowCreator._onClick = function() { 
    if (this.activateCB) { 
        this.activateCB();
    }
};

/**
 * Change the outer dimensions of the widget 
 *
 * @param w [int, optional] Width in pixels
 * @param h [int, optional] Height in pixels
 */
bobj.crv.params.ParamRowCreator.resize = function(w, h) {
    bobj.setOuterSize(this.layer, w, h);
};

/*
================================================================================
TextField

Internal class. Text box that renders correctly in a Parameter UI
================================================================================
*/

/**
 * Constructor. TextField extends TextFieldWidget from the dhtmllib.
 */
bobj.crv.params.newTextField = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        cleanValue: '',
        width: '100%',
        maxChar: null,
        tooltip: null,
        disabled: false,
        editable: true, 
        password: false,
        focusCB: null,
        blurCB: null,
        changeCB: null,
        keyUpCB: null,
        enterCB: null,
        bgColor: bobj.crv.params.BackgroundColor.standard,
        alwaysDirty: false
    }, kwArgs);
    
    var o = newTextFieldWidget(
        kwArgs.id,
        kwArgs.changeCB, 
        kwArgs.maxChar,
        kwArgs.keyUpCB, 
        kwArgs.enterCB, 
        true, //nomargin
        kwArgs.tooltip,
        null, //width
        kwArgs.focusCB, 
        kwArgs.blurCB);
        
    o.widgetType = 'TextField';
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    o.disabled = kwArgs.disabled;
    o.width = kwArgs.width;
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.TextField);
    
    if (kwArgs.cleanValue) {
        o.setValue(kwArgs.cleanValue);    
    }
    
    return o;
};

bobj.crv.params.TextField.setAlwaysDirty = function() {
    this.alwaysDirty = true;
};

bobj.crv.params.TextField.getHTML = function() { 
    var style = {
        width: bobj.unitValue(this.width)
    };
    
    var isIE = MochiKit.Base.isIE();
    var className = this._getBgColorClass(this.bgColor) + ' iactTextField';
    if (isIE && bobj.isQuirksMode()) {
        className += 'IE';    
    }
        
    var attributes = {
        type: this.password ? 'password' : 'text',
        name: this.id,
        id: this.id,
        maxLength: this.maxChar,
        style: style, 
        'class': className,
        oncontextmenu: "event.cancelBubble=true;return true",
        onfocus: "TextFieldWidget_focus(this)",
        onblur:  "TextFieldWidget_blur(this)",
        onchange: "TextFieldWidget_changeCB(event, this)",
        onkeydown: "return TextFieldWidget_keyDownCB(event, this);",
        onkeyup: "return TextFieldWidget_keyUpCB(event, this);",
        onkeypress: "return TextFieldWidget_keyPressCB(event, this);",
        ondragstart: "event.cancelBubble=true; return true;",
        onselectstart: "event.cancelBubble=true; return true;"
    };
    
    if (this.disabled) { 
        attributes.disabled = "disabled";
    }
    
    if (!this.editable) {
        attributes.readonly = "readonly";
        if (isIE) {
            style.filter = 'alpha(opacity=50)';
        }
        else {
            style.opacity = '0.5';
        }
    }
    
    if (this.tooltip) {
        attributes.title = this.tooltip;
    }
    
    return bobj.html.INPUT(attributes);
};

/**
 * Change the background color of the widget
 *
 * @param color [int] BackgroundColor enum value   
 */
bobj.crv.params.TextField.setBgColor = function(color) {
    if (color !== this.bgColor) {
        if (this.layer) {
            var DOM = MochiKit.DOM;
            DOM.removeElementClass(this.layer, this._getBgColorClass(this.bgColor));
            DOM.addElementClass(this.layer, this._getBgColorClass(color));
        }
        this.bgColor = color;
    }
};

bobj.crv.params.TextField.isDirty = function() {
    return this.alwaysDirty === true || this.getValue() !== this.cleanValue;   
};

bobj.crv.params.TextField.setValue = function(value) {
    TextFieldWidget_setValue.call(this, value);   
};

bobj.crv.params.TextField.setCleanValue = function(value) {
    this.cleanValue = value;
};

bobj.crv.params.TextField._getBgColorClass = function(color) {
    var className = 'iactTextFieldBg';
    var Colors = bobj.crv.params.BackgroundColor;
    if (color === Colors.alternate || color === Colors.dirtyAlternate) {
        className += 'Alt';
    }
    if (color === Colors.dirty || color === Colors.dirtyAlternate) {
        className += 'Dirty';
    }
    return className;
};

/*
================================================================================
TextCombo

Internal class. Editable combo box that renders correctly in a Parameter UI
================================================================================
*/

/**
 * Constructor. TextCombo extends TextComboWidget from the dhtmllib.
 */
bobj.crv.params.newTextCombo = function(kwArgs) {
    var UPDATE = MochiKit.Base.update;
    var PARAMS = bobj.crv.params;
    kwArgs = UPDATE({
        id: bobj.uniqueId(),
        width: '100%',
        maxChar: null,
        tooltip: null,
        disabled: false,
        editable: false,
        changeCB: null,
        enterCB: null,
        keyUpCB: null,
        selected: false,
        bgColor: PARAMS.BackgroundColor.standard
    }, kwArgs); 

    var o = newTextComboWidget(
        kwArgs.id,
        kwArgs.maxChar,
        kwArgs.tooltip,
        null, // width
        kwArgs.changeCB,  
        null, // check CB
        null, // beforeShowCB
        null);// formName 
        
    o.widgetType = 'TextCombo';
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs); 
    o.width = kwArgs.width;
    
    // Update instance with member functions
    o.init_TextCombo = o.init;
    UPDATE(o, PARAMS.TextCombo);
    
    o._createTextField(); // Override parent's text property    
    o._createArrow(); 
    o.arrow.dy += 2; // Center the arrow
    o.arrow.disDy += 2;
    
    return o;
};

bobj.crv.params.TextCombo.setAlwaysDirty = function() {
    this.text.setAlwaysDirty();
};

bobj.crv.params.TextCombo.setMenu = function(menu) {
    this.menu = menu;
};

bobj.crv.params.TextCombo.init = function() {
    var BIND = MochiKit.Base.bind;
    this.init_TextCombo();
    this.arrowContainer = getLayer(this.id + '_arrowCtn');
    
    this.layer.onmouseover = BIND(this.showArrow, this,true);
    this.layer.onmouseout =  BIND(this.onMouseOut, this);
    
    if(this.arrow) {
        this.arrow.layer.onfocus = IconWidget_realOverCB;
        this.arrow.layer.onblur = IconWidget_realOutCB;
    }
    
    this.text.setValue(this.cleanValue);
};


bobj.crv.params.TextCombo.onMouseOut = function() {
    if(this.selected === false) {
        this.showArrow(false);
    }
};

bobj.crv.params.TextCombo.setSelected = function(selected) {
    if(this.selected != selected) {
        this.selected = selected;
        this.showArrow(selected);
    }
};

bobj.crv.params.TextCombo.showArrow = function(show) {
    if(this.arrowContainer) {
       this.arrowContainer.style.visibility = show ? "visible" : "hidden";
    }
};

bobj.crv.params.TextCombo.showMenu = function() {
    var menu = this.menu;
    menu.parIcon = this;
    menu.show(true);
    menu.valueSelect(this.text.getValue() + '');
};

bobj.crv.params.TextCombo._createArrow = function() {
    this.arrow = newIconWidget(this.id + "arrow_",
                                bobj.skinUri("menus.gif"),
                                MochiKit.Base.bind(this.showMenu,this),
                                null,
                                (_openMenuPart1 + (this.tooltip? this.tooltip: '' ) + _openMenuPart2),
                                7,//w
                                12, //h
                                0, //dx
                                83, //dy
                                0, //disDx
                                99); //disDy
	
    this.arrow.setClasses("iconnocheck", "combobtnhover", "combobtnhover", "combobtnhover");
    this.arrow.par = this;                           
};

bobj.crv.params.TextCombo._createTextField = function() { 
    this.text = bobj.crv.params.newTextField({
        id: this.id + '_text',
        cleanValue: this.cleanValue,
        width: '100%',
        maxChar: null,
        tooltip: this.tooltip,
        disabled: false,
        editable: this.editable,
        password: false,
        focusCB: null,
        blurCB: null,
        keyUpCB: MochiKit.Base.bind(this._onKeyUp, this),
        enterCB: this.enterCB,
        alwaysDirty: false
    });    
};

bobj.crv.params.TextCombo.getHTML = function() {	
	var h = bobj.html;
    
    var className =  this._getBgColorClass(this.bgColor);
    this.text.bgColor = this.bgColor;
    
    var arrowClassName = 'iactTextComboArrow';
    var arrowStyle = {}; 
    arrowStyle.right = "0px";
    arrowStyle.visibility = "hidden";
    
    if (MochiKit.Base.isIE()) {
        arrowStyle.height = "18px";
        
        if(!bobj.isQuirksMode()) {
            arrowStyle.right = "5px";
        }
    }
    else {
        arrowStyle.height = "16px" ;
    }
    
    var html = h.DIV({id: this.id, 'class': className, style: {width: "100%", position: "relative"}},
        h.DIV({style:{position: "relative"}, 'class': 'iactTextComboTextField'},
            this.text.getHTML()),
        h.DIV({'class': arrowClassName, id : this.id + '_arrowCtn', style:arrowStyle},
            this.arrow.getHTML()));
    
    return html;                    
};

/**
 * Set the content of the text box and update the menu selection
 *
 * @param text [String]
 */
bobj.crv.params.TextCombo.setValue = function(text) {
    this.text.setValue(text);
};

bobj.crv.params.TextCombo.setCleanValue = function(text) {
    this.text.setCleanValue(text);
};

/**
 * Private. Overrides parent.
 */
bobj.crv.params.TextCombo.selectItem = function(item){
    if (item) {
        this.val = item.value;
	    this.text.setValue(item.value, true); // keep the previous clean value		
        this.menu.select(item.index);
    }
};

/**
 * Get the content on the text box
 *
 * @return [String]
 */
bobj.crv.params.TextCombo.getValue = function() {
    return this.text.getValue();
};

/**
 * Change the background color of the widget
 *
 * @param color [int] BackgroundColor enum value 
 */
bobj.crv.params.TextCombo.setBgColor = function(color) {
    if (color !== this.bgColor) {
        if (this.layer) {
            var DOM = MochiKit.DOM;
            DOM.removeElementClass(this.layer, this._getBgColorClass(this.bgColor));
            DOM.addElementClass(this.layer, this._getBgColorClass(color));
        }
        this.bgColor = color;
    }
    if (this.text) {
        this.text.setBgColor(color);    
    }
};

bobj.crv.params.TextCombo._onKeyUp = function(e) {
    var text = this.text.getValue();
    
    if (this.keyUpCB) {
        this.keyUpCB(e);     
    }
};

bobj.crv.params.TextCombo.isDirty = function() {
    return this.text.isDirty();   
};

bobj.crv.params.TextCombo._getBgColorClass = function(color) {
    var className = 'iactTextComboBg';
    var Colors = bobj.crv.params.BackgroundColor;
    if (color === Colors.alternate || color === Colors.dirtyAlternate) {
        className += 'Alt';
    }
    if (color === Colors.dirty || color === Colors.dirtyAlternate) {
        className += 'Dirty';
    }
    return className;
};



bobj.crv.params.newScrollMenuWidget = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id : bobj.uniqueId(),
        originalValues: [],
        hasProperWidth: false,
        hasValueList: false,
        maxVisibleItems: 10,
        openAdvDialogCB: null,
        maxNumParameterDefaultValues: null
    },kwArgs);
    
    var visibleLines = (kwArgs.originalValues.length >= kwArgs.maxVisibleItems) ? kwArgs.maxVisibleItems : kwArgs.originalValues.length;
    if (visibleLines === 1) {
        visibleLines++;
    }

    var o = newScrollMenuWidget(
        "menu_"+ kwArgs.id, //id
        bobj.crv.params.ScrollMenuWidget.onChange, //changeCB
        false, //multi
        null, 
        visibleLines, //lines 
        null, //tooltip 
        null,//dblClickCB 
        null, //keyUpCB
        false, //showLabel
        '', //label 
        '',//convBlanks 
        null, //beforeShowCB
        null); //menuClickCB
      
    o.oldShow = o.show;
    MochiKit.Base.update(o,kwArgs, bobj.crv.params.ScrollMenuWidget);                      

    return o;
};

bobj.crv.params.ScrollMenuWidget.onChange = function() {
    var o = this.parIcon;
    var item = this.getSelection();
    
    if (item) {
        if (this.maxNumParameterDefaultValues && item.index == this.maxNumParameterDefaultValues) {    			
            if (this.openAdvDialogCB) {
                this.openAdvDialogCB();
            }
        }
        else {
            o.val = item.value;
            o.text.setValue(item.value);
        }
    }
    else {
        o.val = null;
        o.text.setValue("");
    }
    
    if (o.changeCB) {
        o.changeCB();
    }
};

bobj.crv.params.ScrollMenuWidget.getPosition = function() {
    if(this.parIcon === null) {
        return;
    }
    
    var layer = this.parIcon.layer;
    var getDimensions = MochiKit.Style.getElementDimensions;
    var position = getPosScrolled(layer);
    var xPos = position.x + 2;
    var yPos = position.y + getDimensions(layer).h + 3;
    if (MochiKit.Base.isIE()) {
        xPos -= 1;
        if(bobj.isQuirksMode()){
            yPos -= 2;
        }
    }
    
    return {x : xPos, y : yPos};
    
};

bobj.crv.params.ScrollMenuWidget.setProperWidth = function() {
    if(this.hasProperWidth === false) {
        this.css.display = "block";
        this.orginalWidth = this.layer.offsetWidth;
        this.css.display = "none";
        this.hasProperWidth = true;   
    }
};

bobj.crv.params.ScrollMenuWidget.setValueList = function() {
    if(this.hasValueList === false ) {
        this.hasValueList = true;
        var origValues = this.originalValues;
        for(var i = 0, len = origValues.length; i < len; i++) {
            this.add(origValues[i], origValues[i],false);
        }
    }
};

bobj.crv.params.ScrollMenuWidget.setFocus = function(focus) {
    if(focus) {
        var focusCB = MochiKit.Base.bind(this.list.focus,this.list);
        setTimeout(focusCB,300);
    }
    else {
        if(this.parIcon.selected === true) {
            this.parIcon.arrow.focus();
        }
    }
};

bobj.crv.params.ScrollMenuWidget.show = function(show) {
	
    if (this.layer===null) {
        this.justInTimeInit();
    }	
    if(this.hasValueList === false) {
        this.setValueList();
    }
    if(this.parIcon === null) {
        return;
    }
    if(this.hasProperWidth === false) {
	    this.setProperWidth();  
    }
    
    if(this.parIcon && this.parIcon.layer) {
        var layer = this.parIcon.layer;
        if(layer.clientWidth > this.orginalWidth) {
            this.css.width = layer.clientWidth  + "px";
            this.list.css.width = layer.clientWidth + "px";
        }
        else {
            this.css.width = this.orginalWidth + "px";
            this.list.css.width = this.orginalWidth + "px";    
        }
    }
    
    var pos = this.getPosition();	
    this.oldShow(show, pos.x, pos.y);
    
    this.setFocus(show);
};

bobj.crv.params.newHelperRow = function(kwArgs) {
    kwArgs = MochiKit.Base.update({
        id: bobj.uniqueId(),
        message : ''
    }, kwArgs);

    var o = newWidget(kwArgs.id);    
    o.widgetType = 'HelperRow';
    
    // Update instance with constructor arguments
    bobj.fillIn(o, kwArgs);
    
    // Update instance with member functions
    MochiKit.Base.update(o, bobj.crv.params.HelperRow);
       
    return o;
};

bobj.crv.params.HelperRow.show = function(show) {
    switch(show) {
        case false:
            this.css.visibility = "hidden";
            this.css.display = "none";
            break;
        case true:
            this.css.visibility = "visible";
            this.css.display = "block";
            break;    
    }
};


bobj.crv.params.HelperRow.getHTML = function() {
    var DIV = bobj.html.DIV;
    
    cssClass = this._getBgColorClass() + ' iactParamRow';
    ieCssClass = 'iactParamRowIE';
    
    var valStyle = '';
    if (MochiKit.Base.isIE() && bobj.isQuirksMode()) {
        cssClass += ' ' + ieCssClass;
        valStyle.width = '100%';
    }
        
    return DIV({id: this.id, 'class': cssClass},
        DIV({'class': 'iactParamValue', style: valStyle}, DIV({'class': 'helperRowMessage'}, "[" + this.message + "]")),DIV({'class': 'iactParamRight'}));
};

bobj.crv.params.HelperRow._getBgColorClass = bobj.crv.params.ParameterValueRow._getBgColorClass;

/**
 * Change the outer dimensions of the widget 
 *
 * @param w [int, optional] Width in pixels
 * @param h [int, optional] Height in pixels
 */
bobj.crv.params.HelperRow.resize = function(w, h) {
    bobj.setOuterSize(this.layer, w, h);
};
