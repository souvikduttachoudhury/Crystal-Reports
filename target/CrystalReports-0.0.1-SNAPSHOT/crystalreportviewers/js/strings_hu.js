// LOCALIZATION STRING

// Strings for calendar.js and calendar_param.js
var L_Today     = "Ma";
var L_January   = "Janu\u00E1r";
var L_February  = "Febru\u00E1r";
var L_March     = "M\u00E1rcius";
var L_April     = "\u00C1prilis";
var L_May       = "M\u00E1jus";
var L_June      = "J\u00FAnius";
var L_July      = "J\u00FAlius";
var L_August    = "Augusztus";
var L_September = "Szeptember";
var L_October   = "Okt\u00F3ber";
var L_November  = "November";
var L_December  = "December";
var L_Su        = "Vas.";
var L_Mo        = "H.";
var L_Tu        = "K.";
var L_We        = "Sze.";
var L_Th        = "Cs.";
var L_Fr        = "P.";
var L_Sa        = "Szo.";

// strings for dt_param.js
var L_TIME_SEPARATOR = ":";
var L_AM_DESIGNATOR = "De.";
var L_PM_DESIGNATOR = "Du.";

// strings for range parameter
var L_FROM = "Kezdete: {0}";
var L_TO = "V\u00E9ge: {0}";
var L_AFTER = "{0} ut\u00E1n";
var L_BEFORE = "{0} el\u0151tt";
var L_FROM_TO = "Kezdete: {0} V\u00E9ge:  {1}";
var L_FROM_BEFORE = "Kezdete: {0} V\u00E9ge: {1} el\u0151tt";
var L_AFTER_TO = "El\u0151tte: {0}, V\u00E9ge: {1}";
var L_AFTER_BEFORE = "El\u0151tte: {0}, V\u00E9ge: {1} el\u0151tt";

// Strings for prompts.js and prompts_param.js
var L_BadNumber     = "This parameter is of type \"Number\" and can only contain a negative sign symbol, digits (\"0-9\"), digit grouping symbols or a decimal symbol. Please correct the entered parameter value.";
var L_BadCurrency   = "This parameter is of type \"Currency\" and can only contain a negative sign symbol, digits (\"0-9\"), digit grouping symbols or a decimal symbol. Please correct the entered parameter value.";
var L_BadDate       = "This parameter is of type \"Date\" and should be in the format \"Date(yyyy,mm,dd)\" where \"yyyy\" is the four digit year, \"mm\" is the month (e.g. January = 1), and \"dd\" is the number of days into the given month.";
var L_BadDateTime   = "This parameter is of type \"DateTime\" and the correct format is \"DateTime(yyyy,mm,dd,hh,mm,ss)\". \"yyyy\" is the four digit year, \"mm\" is the month (e.g. January = 1), \"dd\" is the day of the month, \"hh\" is hours in a 24 hour clock, \"mm\" is minutes and \"ss\" is seconds.";
var L_BadTime       = "This parameter is of type \"Time\" and should be in the format \"Time(hh,mm,ss)\" where \"hh\" is hours in a 24 hour clock, \"mm\" is minutes into the hour, and \"ss\" is seconds into the minute.";
var L_NoValue       = "Nincs \u00E9rt\u00E9k";
var L_BadValue      = "To set \"No Value\", you must set both From and To values to \"No Value\".";
var L_BadBound      = "You cannot set \"No Lower Bound\" together with \"No Upper Bound\".";
var L_NoValueAlready = "This parameter is already set to \"No Value\". Remove \"No Value\" before adding other values";
var L_RangeError    = "A tartom\u00E1ny kezdete nem lehet nagyobb a tartom\u00E1ny v\u00E9g\u00E9n\u00E9l.";
var L_NoDateEntered = "Meg kell adnia egy d\u00E1tumot.";

// Strings for ../html/crystalexportdialog.htm
var L_ExportOptions     = "Export\u00E1l\u00E1si be\u00E1ll\u00EDt\u00E1sok";
var L_PrintOptions      = "Nyomtat\u00E1si be\u00E1ll\u00EDt\u00E1sok";
var L_PrintPageTitle    = "Jelent\u00E9s nyomtat\u00E1sa";
var L_ExportPageTitle   = "Jelent\u00E9s export\u00E1l\u00E1sa";
var L_OK                = "OK";
var L_Cancel            = "M\u00E9gse";
var L_PrintPageRange    = "Adja meg a nyomtatni k\u00EDv\u00E1nt oldaltartom\u00E1nyt.";
var L_ExportPageRange   = "Adja meg az export\u00E1lni k\u00EDv\u00E1nt oldaltartom\u00E1nyt.";
var L_InvalidPageRange  = "Az oldaltartom\u00E1ny \u00E9rt\u00E9k(ek) helytelen(ek). Adjon meg \u00E9rv\u00E9nyes oldaltartom\u00E1nyt.";
var L_ExportFormat      = "V\u00E1lasszon a list\u00E1r\u00F3l export\u00E1l\u00E1si form\u00E1tumot.";
var L_Formats           = "F\u00E1jlform\u00E1tum:";
var L_PageRange         = "Oldaltartom\u00E1ny:";
var L_All               = "Mind";
var L_Pages             = "Oldal:";
var L_From              = "Kezdete:";
var L_To                = "V\u00E9ge:";
var L_PrintStep0        = "Nyomtatand\u00F3:";
var L_PrintStep1        = "1.  In the next dialog that appears, select the \"Open this file\" option and click the OK button.";
var L_PrintStep2        = "2.  Az internetes b\u00F6ng\u00E9sz\u0151 nyomtat\u00E1s gombja helyett ink\u00E1bb kattintson az Acrobat Reader Men\u00FC nyomtat\u00F3ikonj\u00E1ra.";
var L_RTFFormat         = "Rich Text Form\u00E1tum (RTF)";
var L_AcrobatFormat     = "PDF";
var L_CrystalRptFormat  = "Crystal Reports (RPT)";
var L_WordFormat        = "Microsoft Word (97-2003)";
var L_ExcelFormat       = "Microsoft Excel (97-2003)";
var L_ExcelRecordFormat = "Microsoft Excel (97-2003) \u2013 csak adatok";
var L_EditableRTFFormat = "Microsoft Word (97-2003) \u2013 szerkeszthet\u0151";

// Strings for print.js
var L_PrintControlInstallError = "Nem siker\u00FClt telep\u00EDteni a nyomtat\u00E1si ActiveX-vez\u00E9rl\u0151t. Hibak\u00F3d: ";
var L_PrintControlPlugin = "Crystal Reports ActiveX Print Control Plug-in";

// Strings for previewerror.js
var L_SessionExpired = "A munkamenet sor\u00E1n id\u0151t\u00FAll\u00E9p\u00E9s t\u00F6rt\u00E9nt.";
var L_PleaseRefresh = "Kattintson a Friss\u00EDt\u00E9s gombra, \u00E9s pr\u00F3b\u00E1lkozzon \u00FAjra.";
