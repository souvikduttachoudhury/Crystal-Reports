// LOCALIZATION STRING

// Strings for calendar.js and calendar_param.js
var L_Today     = "\uC624\uB298";
var L_January   = "1\uC6D4";
var L_February  = "2\uC6D4";
var L_March     = "3\uC6D4";
var L_April     = "4\uC6D4";
var L_May       = "5\uC6D4";
var L_June      = "6\uC6D4";
var L_July      = "7\uC6D4";
var L_August    = "8\uC6D4";
var L_September = "9\uC6D4";
var L_October   = "10\uC6D4";
var L_November  = "11\uC6D4";
var L_December  = "12\uC6D4";
var L_Su        = "\uC77C";
var L_Mo        = "\uC6D4";
var L_Tu        = "\uD654";
var L_We        = "\uC218";
var L_Th        = "\uBAA9";
var L_Fr        = "\uAE08";
var L_Sa        = "\uD1A0";

// strings for dt_param.js
var L_TIME_SEPARATOR = ":";
var L_AM_DESIGNATOR = "\uC624\uC804";
var L_PM_DESIGNATOR = "\uC624\uD6C4";

// strings for range parameter
var L_FROM = "{0}\uBD80\uD130";
var L_TO = "{0}\uAE4C\uC9C0";
var L_AFTER = "{0} \uC774\uD6C4";
var L_BEFORE = "{0} \uC774\uC804";
var L_FROM_TO = "{0}\uBD80\uD130 {1}\uAE4C\uC9C0";
var L_FROM_BEFORE = "{0}\uBD80\uD130 {1} \uC774\uC804\uAE4C\uC9C0";
var L_AFTER_TO = "{0} \uC774\uD6C4\uBD80\uD130 {1}\uAE4C\uC9C0";
var L_AFTER_BEFORE = "{0} \uC774\uD6C4\uBD80\uD130 {1} \uC774\uC804\uAE4C\uC9C0";

// Strings for prompts.js and prompts_param.js
var L_BadNumber     = "This parameter is of type \"Number\" and can only contain a negative sign symbol, digits (\"0-9\"), digit grouping symbols or a decimal symbol. Please correct the entered parameter value.";
var L_BadCurrency   = "This parameter is of type \"Currency\" and can only contain a negative sign symbol, digits (\"0-9\"), digit grouping symbols or a decimal symbol. Please correct the entered parameter value.";
var L_BadDate       = "This parameter is of type \"Date\" and should be in the format \"Date(yyyy,mm,dd)\" where \"yyyy\" is the four digit year, \"mm\" is the month (e.g. January = 1), and \"dd\" is the number of days into the given month.";
var L_BadDateTime   = "This parameter is of type \"DateTime\" and the correct format is \"DateTime(yyyy,mm,dd,hh,mm,ss)\". \"yyyy\" is the four digit year, \"mm\" is the month (e.g. January = 1), \"dd\" is the day of the month, \"hh\" is hours in a 24 hour clock, \"mm\" is minutes and \"ss\" is seconds.";
var L_BadTime       = "This parameter is of type \"Time\" and should be in the format \"Time(hh,mm,ss)\" where \"hh\" is hours in a 24 hour clock, \"mm\" is minutes into the hour, and \"ss\" is seconds into the minute.";
var L_NoValue       = "\uAC12 \uC5C6\uC74C";
var L_BadValue      = "To set \"No Value\", you must set both From and To values to \"No Value\".";
var L_BadBound      = "You cannot set \"No Lower Bound\" together with \"No Upper Bound\".";
var L_NoValueAlready = "This parameter is already set to \"No Value\". Remove \"No Value\" before adding other values";
var L_RangeError    = "\uBC94\uC704\uC758 \uC2DC\uC791 \uAC12\uC740 \uBC94\uC704\uC758 \uB05D \uAC12\uBCF4\uB2E4 \uD074 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.";
var L_NoDateEntered = "\uB0A0\uC9DC\uB97C \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4.";

// Strings for ../html/crystalexportdialog.htm
var L_ExportOptions     = "\uB0B4\uBCF4\uB0B4\uAE30 \uC635\uC158";
var L_PrintOptions      = "\uC778\uC1C4 \uC635\uC158";
var L_PrintPageTitle    = "\uBCF4\uACE0\uC11C \uC778\uC1C4";
var L_ExportPageTitle   = "\uBCF4\uACE0\uC11C \uB0B4\uBCF4\uB0B4\uAE30";
var L_OK                = "\uD655\uC778";
var L_Cancel            = "\uCDE8\uC18C";
var L_PrintPageRange    = "\uC778\uC1C4\uD560 \uD398\uC774\uC9C0 \uBC94\uC704\uB97C \uC785\uB825\uD558\uC2ED\uC2DC\uC624.";
var L_ExportPageRange   = "\uB0B4\uBCF4\uB0BC \uD398\uC774\uC9C0 \uBC94\uC704\uB97C \uC785\uB825\uD558\uC2ED\uC2DC\uC624.";
var L_InvalidPageRange  = "\uD398\uC774\uC9C0 \uBC94\uC704 \uAC12\uC774 \uC798\uBABB\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC62C\uBC14\uB978 \uD398\uC774\uC9C0 \uBC94\uC704\uB97C \uC785\uB825\uD558\uC2ED\uC2DC\uC624.";
var L_ExportFormat      = "\uBAA9\uB85D\uC5D0\uC11C \uB0B4\uBCF4\uB0B4\uAE30 \uD615\uC2DD\uC744 \uC120\uD0DD\uD558\uC2ED\uC2DC\uC624.";
var L_Formats           = "\uD30C\uC77C \uD615\uC2DD:";
var L_PageRange         = "\uD398\uC774\uC9C0 \uBC94\uC704:";
var L_All               = "\uBAA8\uB450";
var L_Pages             = "\uD398\uC774\uC9C0:";
var L_From              = "\uC2DC\uC791:";
var L_To                = "\uB05D:";
var L_PrintStep0        = "\uC778\uC1C4\uD558\uB824\uBA74";
var L_PrintStep1        = "1.  In the next dialog that appears, select the \"Open this file\" option and click the OK button.";
var L_PrintStep2        = "2.  \uC778\uD130\uB137 \uBE0C\uB77C\uC6B0\uC800\uC758 \uC778\uC1C4 \uB2E8\uCD94 \uB300\uC2E0 Acrobat Reader \uBA54\uB274\uC5D0\uC11C \uD504\uB9B0\uD130 \uC544\uC774\uCF58\uC744 \uD074\uB9AD\uD569\uB2C8\uB2E4.";
var L_RTFFormat         = "\uC11C\uC2DD \uC788\uB294 \uD14D\uC2A4\uD2B8 \uD615\uC2DD (RTF)";
var L_AcrobatFormat     = "PDF";
var L_CrystalRptFormat  = "Crystal Reports (RPT)";
var L_WordFormat        = "Microsoft Word (97-2003)";
var L_ExcelFormat       = "Microsoft Excel (97-2003)";
var L_ExcelRecordFormat = "Microsoft Excel (97-2003) - \uB370\uC774\uD130\uB9CC";
var L_EditableRTFFormat = "Microsoft Word (97-2003) - \uD3B8\uC9D1 \uAC00\uB2A5";

// Strings for print.js
var L_PrintControlInstallError = "ActiveX \uC778\uC1C4 \uCEE8\uD2B8\uB864\uC744 \uC124\uCE58\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC624\uB958 \uCF54\uB4DC: ";
var L_PrintControlPlugin = "Crystal Reports ActiveX \uC778\uC1C4 \uCEE8\uD2B8\uB864 \uD50C\uB7EC\uADF8 \uC778";

// Strings for previewerror.js
var L_SessionExpired = "\uC138\uC158 \uC2DC\uAC04\uC774 \uCD08\uACFC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.";
var L_PleaseRefresh = "[\uC0C8\uB85C \uACE0\uCE68] \uB2E8\uCD94\uB97C \uB204\uB978 \uB2E4\uC74C \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC2ED\uC2DC\uC624.";
