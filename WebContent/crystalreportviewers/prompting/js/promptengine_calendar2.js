if(typeof(bobj) == "undefined") bobj = {};
if(typeof(bobj.prompt) == "undefined") bobj.prompt = {};

bobj.prompt.Calendar = function(formName,dateFormat,locale,promptJsFilePrefix) {
    this.locale = locale;
    this.crystalreportviewerPath = promptJsFilePrefix + '/../';
	    
    this.loadFiles();
    
    this.formName = formName;
    this.dateFormat = dateFormat;
    this.dateTimeFormat = dateFormat +  " " + "H:mm:ss";
    this.isDateTime = false;    
}

bobj.prompt.Calendar.prototype = {

    /*
     * shows calendar for the specified input
     * @param e     [event] 
     * @param inputName [DOM element]       The node that will receive the calendar value
     */
    show : function(e,inputName) {
        this.calendar = bobj.crv.Calendar.getInstance();
        this.input  = document.getElementById (inputName);
        
        var srcElem = e.target ? e.target : e.srcElement;
        var pos = this._getPosition(srcElem);
        
        this._setValue(this.input.value);

        this._setSignals(true); // sets OK, and cancel event handlers
        
        this.calendar.setShowTime(this.isDateTime);
        this.calendar.show(true,pos.x,pos.y);
    },

    setIsDateTime : function(isDateTime) {
        this.isDateTime = isDateTime;
    },
           
    _getPosition : function(element) {
        return MochiKit.Style.getElementPosition(element);
    },
        
    _setValue : function(value) {
        var date = this._getDateValue(value);
        if(!date) {
            date = new Date();
        }
        this.calendar.setDate(date);
    },
    
    _onOkayClick : function(dateValue) {
        this._setFieldValue(dateValue);
    },
        
    _setFieldValue : function(dateValue) {
        if(this.input) {
            this.input.value = this._getStringValue(dateValue);
        }
    },
    
    _onHide : function() {
		this._removeSignals();
    },
    
    _getStringValue : function(dateValue) {
        var format = this.isDateTime ? this.dateTimeFormat : this.dateFormat;
        return  bobj.external.date.formatDate(dateValue, format);      
        
    },
    
    _getDateValue : function(stringValue) {
        var format = this.isDateTime ? this.dateTimeFormat : this.dateFormat;
        return bobj.external.date.getDateFromFormat(stringValue, format);   
    },
    
    _setSignals: function(isConnected) {
        var op = isConnected ? MochiKit.Signal.connect : MochiKit.Signal.disconnect;
        op(this.calendar, this.calendar.Signals.OK_CLICK, this, '_onOkayClick');
        op(this.calendar, this.calendar.Signals.ON_HIDE, this, '_onHide');
    },    
    
    _removeSignals: function() {
        this._setSignals(false);    
    },

	loadJsResources : function() {
					
		var resources = [
			'js/external/date.js',
			'js/MochiKit/Base.js',
			'js/MochiKit/DOM.js',
			'js/MochiKit/Style.js',
			'js/MochiKit/Signal.js',
			'js/dhtmllib/dom.js',
			'prompting/js/initDhtmlLib.js',
			'js/dhtmllib/palette.js',
			'js/dhtmllib/menu.js',
			'js/crviewer/html.js',
			'js/crviewer/common.js',
			'js/crviewer/Calendar.js'
			]
		
		for(var i = 0 ; i < resources.length; i++) {
			this.loadJsFile(resources[i]);
		}	

	},
	
	loadJsFile : function(uri) {
		document.write("<script src=\"" + this.crystalreportviewerPath +  uri + "\" language=\"javascript\"></script>");
	},
	
	loadLocaleStrings: function() {
		var localeFiles = [
			'js/dhtmllib/language/en/labels.js',
			'js/crviewer/strings_en.js'		
		]
		
        var splitChar = '_';  // default to java's locale split character	
        if (this.locale.indexOf ('-') > 0)
            splitChar = '-'; // must be .Net's locale split
			
        var lang = this.locale.split(splitChar);

        if(lang.length >= 1) {
            localeFiles.push('js/dhtmllib/language/' + lang[0] + '/labels.js');
            localeFiles.push('js/crviewer/strings_' + lang[0]  + '.js');    
        }
        
        if(lang.length >= 2) {
            localeFiles.push('js/dhtmllib/language/' + lang[0] + '_' + lang[1] + '/labels.js');
            localeFiles.push('js/crviewer/strings_' + lang[0] + '_' + lang[1]  + '.js');  
        }
           
        for (var i = 0; i < localeFiles.length; i++) {
            this.loadJsFile(localeFiles[i]);
        }		
	},
	
	loadFiles : function() {
		if(typeof(bobj.crv) == "undefined") {
			window["promptengine_skin"] = this.crystalreportviewerPath  + "js/dhtmllib/images/skin_standard/";
			window["promptengine_style"] = this.crystalreportviewerPath  + "js/crviewer/images/";
			window["promptengine_lang"] = this.locale;  	
			this.loadLocaleStrings();
			this.loadJsResources();
		}

	}
};
