/* Copyright (c) Business Objects 2006. All rights reserved. */

var L_bobj_crv_MainReport = "Hovedrapport";
// Viewer Toolbar tooltips
var L_bobj_crv_FirstPage = "G\u00E5 til f\u00F8rste side";
var L_bobj_crv_PrevPage = "G\u00E5 til forrige side";
var L_bobj_crv_NextPage = "G\u00E5 til n\u00E6ste side";
var L_bobj_crv_LastPage = "G\u00E5 til sidste side";
var L_bobj_crv_ParamPanel = "Parameterpanel";
var L_bobj_crv_Parameters = "Parametre";
var L_bobj_crv_GroupTree = "Gruppetr\u00E6";
var L_bobj_crv_DrillUp = "Analyser stigende";
var L_bobj_crv_Refresh = "Opdater rapport";
var L_bobj_crv_Zoom = "Zoom";
var L_bobj_crv_SelectPage = "G\u00E5 til side";
var L_bobj_crv_SearchText = "S\u00F8g efter tekst";
var L_bobj_crv_Export = "Eksporter denne rapport";
var L_bobj_crv_Print = "Udskriv denne rapport";
var L_bobj_crv_TabList = "Tabulatorliste";
var L_bobj_crv_Close = "Luk";
var L_bobj_crv_Logo=  "Business Objects Logo"

var L_bobj_crv_Show = "Vis";
var L_bobj_crv_Hide = "Skjul";

var L_bobj_crv_submitBtnLbl = "Eksporter";
var L_bobj_crv_ActiveXPrintDialogTitle = "Udskriv";
var L_bobj_crv_PDFPrintDialogTitle = "Udskriv til PDF";
var L_bobj_crv_PrintRangeLbl = "Sideomr\u00E5de:";
var L_bobj_crv_PrintAllLbl = "Alle sider";
var L_bobj_crv_PrintPagesLbl = "V\u00E6lg sider";
var L_bobj_crv_PrintFromLbl = "Fra:";
var L_bobj_crv_PrintToLbl = "Til:";
var L_bobj_crv_PrintInfoTitle = "Udskriv til PDF:";
var L_bobj_crv_PrintInfo1 = 'Fremviseren skal eksportere til PDF, f\u00F8r det er muligt at udskrive. V\u00E6lg Udskriv fra PDF-l\u00E6seren, n\u00E5r dokumentet er \u00E5bnet.';
var L_bobj_crv_PrintInfo2 = 'Bem\u00E6rk! Du skal have en PDF-l\u00E6ser (f.eks. Adobe Reader) installeret for at kunne udskrive.';
var L_bobj_crv_PrintPageRangeError = "Angiv et gyldigt sideomr\u00E5de.";

var L_bobj_crv_ExportBtnLbl = "Eksporter";
var L_bobj_crv_ExportDialogTitle = "Eksporter";
var L_bobj_crv_ExportFormatLbl = "Filformat:";
var L_bobj_crv_ExportInfoTitle = "S\u00E5dan eksporterer du:";

var L_bobj_crv_ParamsApply = "Anvend";
var L_bobj_crv_ParamsAdvDlg = "Rediger parameterv\u00E6rdi";
var L_bobj_crv_ParamsDelete = "Slet";
var L_bobj_crv_ParamsDeleteTooltip = "Slet parameterv\u00E6rdi";
var L_bobj_crv_ParamsAddValue = "Klik for at tilf\u00F8je...";
var L_bobj_crv_ParamsApplyTip = "Anvend parameterv\u00E6rdier";
var L_bobj_crv_ParamsDlgTitle = "Angiv v\u00E6rdier";
var L_bobj_crv_ParamsCalBtn = "Vis en kalender";
var L_bobj_crv_Undo= "Fortryd";
var L_bobj_crv_UndoTip = "Fortryd alle \u00E6ndringer";
var L_bobj_crv_ParamsDirtyTip = "Klik p\u00E5 knappen Anvend for at anvende \u00E6ndringerne";
var L_bobj_crv_ParamsDataTip = "Dette er en datahentningsparameter";
var L_bobj_crv_ParamsMaxNumDefaultValues = "Klik her for at f\u00E5 flere elementer...";

var L_bobj_crv_ParamsInvalidTitle = "Parameterv\u00E6rdien er ugyldig";
var L_bobj_crv_ParamsTooLong = "Parameterv\u00E6rdien m\u00E5 ikke v\u00E6re l\u00E6ngere end %1 tegn";
var L_bobj_crv_ParamsTooShort = "Parameterv\u00E6rdien skal v\u00E6re mindst %1 tegn lang";
var L_bobj_crv_ParamsBadNumber = "Denne parameter er af typen \"Tal\" og m\u00E5 kun indeholde symbolet for negative tal, cifrene (\"0-9\"), ciffergruppeseparatorer eller et decimaltegn";
var L_bobj_crv_ParamsBadCurrency = "Denne parameter er af typen \"Valuta\" og m\u00E5 kun indeholde symbolet for negative tal, cifrene (\"0-9\"), ciffergruppeseparatorer eller et decimaltegn. ";
var L_bobj_crv_ParamsBadDate = "Denne parameter er af typen \"Dato\" og skal v\u00E6re i formatet \"%1\", hvor \"\"\u00E5\u00E5\u00E5\u00E5\"\" er det fircifrede \u00E5rstal, \"mm\" er m\u00E5neden (f.eks. januar = 1), og \"dd\" er dagen i m\u00E5neden.";
var L_bobj_crv_ParamsBadTime = "Denne parameter er af typen \"Klokkesl\u00E6t\" og skal v\u00E6re i formatet \"tt:mm:ss\", hvor \"tt\" er timer i et 24-timers ur, \"mm\" er minutter, og \"ss\" er sekunder.";
var L_bobj_crv_ParamsBadDateTime = "Denne parameter er af typen \"DatoKlokkesl\u00E6t\", og det aktuelle format er \"%1 tt:mm:ss\". \"\u00E5\u00E5\u00E5\u00E5\" er det fircifrede \u00E5rstal, \"mm\" er m\u00E5neden (f.eks. januar = 1), \"dd\" er dagen i m\u00E5neden, \"tt\" er timer i et 24-timers ur, \"mm\" er minutter, og \"ss\" er sekunder";
var L_bobj_crv_ParamsMinTooltip = "Angiv en %1-v\u00E6rdi, der er st\u00F8rre end eller lig med %2.";
var L_bobj_crv_ParamsMaxTooltip = "Angiv en %1-v\u00E6rdi, der er mindre end eller lig med %2.";
var L_bobj_crv_ParamsMinAndMaxTooltip = "Angiv en %1-v\u00E6rdi mellem %2 og %3.";
var L_bobj_crv_ParamsStringMinOrMaxTooltip = "L\u00E6ngden af %1 for dette felt er %2.";
var L_bobj_crv_ParamsStringMinAndMaxTooltip = "V\u00E6rdien skal v\u00E6re p\u00E5 mellem %1 og %2 tegn.";
var L_bobj_crv_ParamsYearToken = "\u00E5\u00E5\u00E5\u00E5";
var L_bobj_crv_ParamsMonthToken = "mm";
var L_bobj_crv_ParamsDayToken = "dd";
var L_bobj_crv_ParamsReadOnly = "Denne parameter er af typen \"Skrivebeskyttet\".";
var L_bobj_crv_ParamsNoValue = "Ingen v\u00E6rdi";
var L_bobj_crv_ParamsDuplicateValue = "Dobbelte v\u00E6rdier er ikke tilladt.";
var L_bobj_crv_Error = "Fejl";
var L_bobj_crv_OK = "OK";
var L_bobj_crv_Cancel = "Annuller";
var L_bobj_crv_showDetails = "Vis detaljer";
var L_bobj_crv_hideDetails = "Skjul detaljer";
var L_bobj_crv_RequestError = "Anmodningen kan ikke behandles";
var L_bobj_crv_ServletMissing = "Fremviseren kan ikke oprette forbindelse til CrystalReportViewerServlet, der h\u00E5ndterer asynkrone anmodninger.\nKontroller, at Servlet og Servlet-Mapping er erkl\u00E6ret korrekt i filen web.xml for programmet.";
var L_bobj_crv_FlashRequired = "Dette indhold kr\u00E6ver Adobe Flash Player 9 eller nyere. {0}Klik her for at installere";

var L_bobj_crv_Tree_Drilldown_Node = "Node %1 til faldende analyse";

var L_bobj_crv_ReportProcessingMessage = "Vent, mens dokumentet behandles.";
var L_bobj_crv_PrintControlProcessingMessage = "Vent, mens Crystal Reports - udskriftskontrol indl\u00E6ses.";

var L_bobj_crv_SundayShort = "S";
var L_bobj_crv_MondayShort = "M";
var L_bobj_crv_TuesdayShort = "T";
var L_bobj_crv_WednesdayShort = "O";
var L_bobj_crv_ThursdayShort = "T";
var L_bobj_crv_FridayShort = "F";
var L_bobj_crv_SaturdayShort = "L";

var L_bobj_crv_Minimum = "minimum";
var L_bobj_crv_Maximum = "maksimum";

var L_bobj_crv_Date = "Dato";
var L_bobj_crv_Time = "Klokkesl\u00E6t";
var L_bobj_crv_DateTime = "DateTime";
var L_bobj_crv_Boolean = "Boolesk";
var L_bobj_crv_Number = "Tal";

var L_bobj_crv_InteractiveParam_NoAjax = "Den anvendte webbrowser er ikke konfigureret til at vise parameterpanelet.";
// <script>
/*
=============================================================
WebIntelligence(r) Report Panel
Copyright(c) 2001-2003 Business Objects S.A.
All rights reserved

Use and support of this software is governed by the terms
and conditions of the software license agreement and support
policy of Business Objects S.A. and/or its subsidiaries. 
The Business Objects products and technology are protected
by the US patent number 5,555,403 and 6,247,008

File: labels.js


=============================================================
*/

_default="Standard"
_black="Sort"
_brown="Brun"
_oliveGreen="Olivengrøn"
_darkGreen="Mørkegrøn"
_darkTeal="Dybblå"
_navyBlue="Marineblå"
_indigo="Indigo"
_darkGray="Mørkegrå"
_darkRed="Mørkerød"
_orange="Orange"
_darkYellow="Mørkegul"
_green="Grøn"
_teal="Blågrøn"
_blue="Blå"
_blueGray="Blågrå"
_mediumGray="Mellemgrå"
_red="Rød"
_lightOrange="Lys orange"
_lime="Limegrøn"
_seaGreen="Havgrøn"
_aqua="Akvamarin"
_lightBlue="Lyseblå"
_violet="Violet"
_gray="Grå"
_magenta="Magenta"
_gold="Gylden"
_yellow="Gul"
_brightGreen="Knaldgrøn"
_cyan="Cyan"
_skyBlue="Himmelblå"
_plum="Blomme"
_lightGray="Lysegrå"
_pink="Pink"
_tan="Gyldenbrun"
_lightYellow="Lysegul"
_lightGreen="Lysegrøn"
_lightTurquoise="Blegturkis"
_paleBlue="Blegblå"
_lavender="Lavendel"
_white="Hvid"
_lastUsed="Sidst anvendt:"
_moreColors="Flere farver..."

_month=new Array

_month[0]="JANUAR"
_month[1]="FEBRUAR"
_month[2]="MARTS"
_month[3]="APRIL"
_month[4]="MAJ"
_month[5]="JUNI"
_month[6]="JULI"
_month[7]="AUGUST"
_month[8]="SEPTEMBER"
_month[9]="OKTOBER"
_month[10]="NOVEMBER"
_month[11]="DECEMBER"

_day=new Array
_day[0]="S"
_day[1]="M"
_day[2]="T"
_day[3]="O"
_day[4]="T"
_day[5]="F"
_day[6]="L"

_today="I dag"

_AM="AM"
_PM="PM"

_closeDialog="Luk vindue"

_lstMoveUpLab="Flyt op"
_lstMoveDownLab="Flyt ned"
_lstMoveLeftLab="Flyt til venstre" 
_lstMoveRightLab="Flyt til højre"
_lstNewNodeLab="Tilføj indlejret filter"
_lstAndLabel="OG"
_lstOrLabel="ELLER"
_lstSelectedLabel="Valgt"
_lstQuickFilterLab="Tilføj hurtigfilter"

_openMenuPart1="Klik her for at få adgang til "
_openMenuPart2=" indstillinger"
_openCalendarLab="Åbn kalender"

_scroll_first_tab="Rul til første fane"
_scroll_previous_tab="Rul til forrige fane"
_scroll_next_tab="Rul til næste fane"
_scroll_last_tab="Rul til sidste fane"

_expandedLab="Udvidet"
_collapsedLab="Skjult"
_selectedLab="Valgt"

_expandNode="Udvid node %1"
_collapseNode="Skjul node %1"

_checkedPromptLab="Angivet"
_nocheckedPromptLab="Ikke angivet"
_selectionPromptLab="værdier er lig med"
_noselectionPromptLab="ingen værdier"

_lovTextFieldLab="Indtast værdier her"
_lovCalendarLab="Indtast dato her"
_lovPrevChunkLab="Gå til forrige segment"
_lovNextChunkLab="Gå til næste segment"
_lovComboChunkLab="Segment"
_lovRefreshLab="Opdater"
_lovSearchFieldLab="Indtast tekst, der søges efter, her"
_lovSearchLab="Søg"
_lovNormalLab="Normal"
_lovMatchCase="Forskel på store og små bogstaver"
_lovRefreshValuesLab="Opdater værdier"

_calendarNextMonthLab="Gå til næste måned"
_calendarPrevMonthLab="Gå til forrige måned"
_calendarNextYearLab="Gå til næste år"
_calendarPrevYearLab="Gå til forrige år"
_calendarSelectionLab="Valgt dag "

_menuCheckLab="Markeret"
_menuDisableLab="Deaktiveret"

_RGBTxtBegin= "RGB("
_RGBTxtEnd= ")"

_helpLab="Hjælp"

_waitTitleLab="Vent venligst"
_cancelButtonLab="Annuller"

_modifiers= new Array
_modifiers[0]="Ctrl+"
_modifiers[1]="Shift+"
_modifiers[2]="Alt+"

_bordersMoreColorsLabel="Flere rammer..."
_bordersTooltip=new Array
_bordersTooltip[0]="Ingen ramme"
_bordersTooltip[1]="Venstre ramme"
_bordersTooltip[2]="Højre ramme"
_bordersTooltip[3]="Nederste ramme"
_bordersTooltip[4]="Medium nederste ramme"
_bordersTooltip[5]="Tyk nederste ramme"
_bordersTooltip[6]="Øverste og nederste ramme"
_bordersTooltip[7]="Øverste og medium nederste ramme"
_bordersTooltip[8]="Øverste og tyk nederste ramme"
_bordersTooltip[9]="Alle rammer"
_bordersTooltip[10]="Alle rammer medium"
_bordersTooltip[11]="Alle rammer tykke"/* Copyright (c) Business Objects 2006. All rights reserved. */

// LOCALIZATION STRING

// Strings for calendar.js and calendar_param.js
var L_Today     = "I dag";
var L_January   = "Januar";
var L_February  = "Februar";
var L_March     = "Marts";
var L_April     = "April";
var L_May       = "Maj";
var L_June      = "Juni";
var L_July      = "Juli";
var L_August    = "August";
var L_September = "September";
var L_October   = "Oktober";
var L_November  = "November";
var L_December  = "December";
var L_Su        = "S\u00F8";
var L_Mo        = "Ma";
var L_Tu        = "Ti";
var L_We        = "On";
var L_Th        = "To";
var L_Fr        = "Fr";
var L_Sa        = "L\u00F8";

// Strings for prompts.js and prompts_param.js
var L_YYYY          = "\u00E5\u00E5\u00E5\u00E5";
var L_MM            = "mm";
var L_DD            = "dd";
var L_BadNumber     = "Denne parameter er af typen \"Tal\" og m\u00E5 kun indeholde symbolet for negative tal, cifrene (\"0-9\"), ciffergruppeseparatorer eller et decimaltegn. Ret den indtastede parameterv\u00E6rdi.";
var L_BadCurrency   = "Denne parameter er af typen \"Valuta\" og m\u00E5 kun indeholde symbolet for negative tal, cifrene (\"0-9\"), ciffergruppeseparatorer eller et decimaltegn. Ret den indtastede parameterv\u00E6rdi.";
var L_BadDate       = "Denne parameter er af typen \"Dato\" og skal v\u00E6re i formatet \"%1\", hvor \"yyyy\" er det fircifrede \u00E5rstal, \"mm\" er m\u00E5neden (f.eks. januar = 1), og \"dd\" er dagen i m\u00E5neden.";
var L_BadDateTime   = "Denne parameter er af typen \"DatoKlokkesl\u00E6t\", og det aktuelle format er \"%1 hh:mm:ss\". \"yyyy\" er det fircifrede \u00E5rstal, \"mm\" er m\u00E5neden (f.eks. januar = 1), \"dd\" er dagen i m\u00E5neden, \"hh\" er timer i et 24-timers ur, \"mm\" er minutter, og \"ss\" er sekunder.";
var L_BadTime       = "Denne parameter er af typen \"Klokkesl\u00E6t\" og skal v\u00E6re i formatet \"hh:mm:ss\", hvor \"hh\" er timer i et 24-timers ur, \"mm\" er minutter, og \"ss\" er sekunder.";
var L_NoValue       = "Ingen v\u00E6rdi";
var L_BadValue      = "Hvis du vil angive \"Ingen v\u00E6rdi\", skal du angive b\u00E5de v\u00E6rdien Fra og v\u00E6rdien Til til \"Ingen v\u00E6rdi\".";
var L_BadBound      = "Du kan ikke angive \"Ingen nedre gr\u00E6nse\" sammen med \"Ingen \u00F8vre gr\u00E6nse\".";
var L_NoValueAlready = "Denne parameter er allerede angivet til \"Ingen v\u00E6rdi\". Fjern \"Ingen v\u00E6rdi\", f\u00F8r du tilf\u00F8jer andre v\u00E6rdier.";
var L_RangeError    = "Starten p\u00E5 omr\u00E5det m\u00E5 ikke v\u00E6re st\u00F8rre end slutningen p\u00E5 omr\u00E5det.";
var L_NoDateEntered = "Du skal indtaste en dato.";

// Strings for filter dialog
var L_closeDialog="Luk vindue";

var L_SetFilter = "Angiv filter";
var L_OK        = "OK";
var L_Cancel    = "Annuller";

 /* Crystal Decisions Confidential Proprietary Information */
