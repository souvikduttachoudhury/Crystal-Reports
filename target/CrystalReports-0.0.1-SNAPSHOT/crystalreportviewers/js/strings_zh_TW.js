// LOCALIZATION STRING

// Strings for calendar.js and calendar_param.js
var L_Today     = "\u4ECA\u5929";
var L_January   = "\u4E00\u6708";
var L_February  = "\u4E8C\u6708";
var L_March     = "\u4E09\u6708";
var L_April     = "\u56DB\u6708";
var L_May       = "\u4E94\u6708";
var L_June      = "\u516D\u6708";
var L_July      = "\u4E03\u6708";
var L_August    = "\u516B\u6708";
var L_September = "\u4E5D\u6708";
var L_October   = "\u5341\u6708";
var L_November  = "\u5341\u4E00\u6708";
var L_December  = "\u5341\u4E8C\u6708";
var L_Su        = "\u9031\u65E5";
var L_Mo        = "\u9031\u4E00";
var L_Tu        = "\u9031\u4E8C";
var L_We        = "\u9031\u4E09";
var L_Th        = "\u9031\u56DB";
var L_Fr        = "\u9031\u4E94";
var L_Sa        = "\u9031\u516D";

// strings for dt_param.js
var L_TIME_SEPARATOR = ":";
var L_AM_DESIGNATOR = "\u4E0A\u5348";
var L_PM_DESIGNATOR = "\u4E0B\u5348";

// strings for range parameter
var L_FROM = "From {0}";
var L_TO = "To {0}";
var L_AFTER = "After {0}";
var L_BEFORE = "Before {0}";
var L_FROM_TO = "From {0} to {1}";
var L_FROM_BEFORE = "From {0} to before {1}";
var L_AFTER_TO = "After {0} to {1}";
var L_AFTER_BEFORE = "After {0} to before {1}";

// Strings for prompts.js and prompts_param.js
var L_BadNumber     = "This parameter is of type \"Number\" and can only contain a negative sign symbol, digits (\"0-9\"), digit grouping symbols or a decimal symbol. Please correct the entered parameter value.";
var L_BadCurrency   = "This parameter is of type \"Currency\" and can only contain a negative sign symbol, digits (\"0-9\"), digit grouping symbols or a decimal symbol. Please correct the entered parameter value.";
var L_BadDate       = "This parameter is of type \"Date\" and should be in the format \"Date(yyyy,mm,dd)\" where \"yyyy\" is the four digit year, \"mm\" is the month (e.g. January = 1), and \"dd\" is the number of days into the given month.";
var L_BadDateTime   = "This parameter is of type \"DateTime\" and the correct format is \"DateTime(yyyy,mm,dd,hh,mm,ss)\". \"yyyy\" is the four digit year, \"mm\" is the month (e.g. January = 1), \"dd\" is the day of the month, \"hh\" is hours in a 24 hour clock, \"mm\" is minutes and \"ss\" is seconds.";
var L_BadTime       = "This parameter is of type \"Time\" and should be in the format \"Time(hh,mm,ss)\" where \"hh\" is hours in a 24 hour clock, \"mm\" is minutes into the hour, and \"ss\" is seconds into the minute.";
var L_NoValue       = "\u6C92\u6709\u503C";
var L_BadValue      = "\u82E5\u8981\u8A2D\u5B9A\u6210 [\u6C92\u6709\u503C]\uFF0C\u5FC5\u9808\u540C\u6642\u5C07 [\u5F9E] \u548C [\u5230] \u7684\u503C\u8A2D\u6210 [\u6C92\u6709\u503C]\u3002";
var L_BadBound      = "[\u7121\u4E0B\u9650] \u4E0D\u80FD\u8207 [\u7121\u4E0A\u9650] \u4E00\u8D77\u8A2D\u5B9A\u3002";
var L_NoValueAlready = "\u6B64\u53C3\u6578\u5DF2\u7D93\u8A2D\u5B9A\u6210 [\u6C92\u6709\u503C]\u3002\u5728\u52A0\u5165\u5176\u4ED6\u503C\u4E4B\u524D\uFF0C\u8ACB\u5148\u79FB\u9664 [\u6C92\u6709\u503C]\u3002";
var L_RangeError    = "\u7BC4\u570D\u8D77\u9EDE\u4E0D\u5F97\u5927\u65BC\u7BC4\u570D\u7D42\u9EDE\u3002";
var L_NoDateEntered = "\u5FC5\u9808\u8F38\u5165\u65E5\u671F\u3002";

// Strings for ../html/crystalexportdialog.htm
var L_ExportOptions     = "\u532F\u51FA\u9078\u9805";
var L_PrintOptions      = "\u5217\u5370\u9078\u9805";
var L_PrintPageTitle    = "\u5217\u5370\u5831\u8868";
var L_ExportPageTitle   = "\u532F\u51FA\u5831\u8868";
var L_OK                = "\u78BA\u5B9A";
var L_Cancel            = "\u53D6\u6D88";
var L_PrintPageRange    = "\u8F38\u5165\u8981\u5217\u5370\u7684\u9801\u9762\u7BC4\u570D\u3002";
var L_ExportPageRange   = "\u8F38\u5165\u8981\u532F\u51FA\u7684\u9801\u9762\u7BC4\u570D\u3002";
var L_InvalidPageRange  = "The page range value(s) are incorrect.  Please enter a valid page range.";
var L_ExportFormat      = "\u8ACB\u5F9E\u6E05\u55AE\u4E2D\u9078\u53D6\u532F\u51FA\u683C\u5F0F\u3002";
var L_Formats           = "\u6A94\u6848\u683C\u5F0F:";
var L_PageRange         = "\u9801\u9762\u7BC4\u570D:";
var L_All               = "\u5168\u90E8";
var L_Pages             = "\u9801\u6578:";
var L_From              = "\u5F9E:";
var L_To                = "\u5230:";
var L_PrintStep0        = "\u82E5\u8981\u5217\u5370:";
var L_PrintStep1        = "1.  \u5728\u4E0B\u4E00\u500B\u51FA\u73FE\u7684\u5C0D\u8A71\u65B9\u584A\u4E2D\uFF0C\u8ACB\u9078\u53D6 [\u958B\u555F\u6B64\u6A94\u6848] \u9078\u9805\uFF0C\u7136\u5F8C\u518D\u6309\u4E00\u4E0B [\u78BA\u5B9A] \u6309\u9215\u3002";
var L_PrintStep2        = "2.  \u6309\u4E00\u4E0B Acrobat Reader \u529F\u80FD\u8868\u4E0A\u7684\u5370\u8868\u6A5F\u5716\u793A\uFF0C\u800C\u4E0D\u662F\u7DB2\u969B\u7DB2\u8DEF\u700F\u89BD\u5668\u4E0A\u7684\u5217\u5370\u6309\u9215\u3002";
var L_RTFFormat         = "Rich Text Format (RTF)";
var L_AcrobatFormat     = "PDF";
var L_CrystalRptFormat  = "Crystal Reports (RPT)";
var L_WordFormat        = "Microsoft Word (97-2003)";
var L_ExcelFormat       = "Microsoft Excel (97-2003)";
var L_ExcelRecordFormat = "Microsoft Excel (97-2003) Data-Only";
var L_EditableRTFFormat = "Microsoft Word (97-2003) - Editable";

// Strings for print.js
var L_PrintControlInstallError = "ActiveX \u5217\u5370\u63A7\u5236\u9805\u5B89\u88DD\u5931\u6557\u3002\u932F\u8AA4\u78BC:";
var L_PrintControlPlugin = "Crystal Reports ActiveX \u5217\u5370\u63A7\u5236\u9805 Plug-in";

// Strings for previewerror.js
var L_SessionExpired = "\u60A8\u7684\u5DE5\u4F5C\u968E\u6BB5\u5DF2\u903E\u6642\u3002";
var L_PleaseRefresh = "\u8ACB\u6309 [\u91CD\u65B0\u6574\u7406] \u6309\u9215\u4E26\u518D\u8A66\u4E00\u6B21\u3002";
