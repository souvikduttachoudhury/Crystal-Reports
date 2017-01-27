/* Copyright (c) Business Objects 2006. All rights reserved. */

// BEGIN USER-EDITABLE SECTION -----------------------------------------------------

// CALENDAR COLORS
topBackground    = "black";         // BG COLOR OF THE TOP FRAME
bottomBackground = "white";         // BG COLOR OF THE BOTTOM FRAME
tableBGColor     = "black";         // BG COLOR OF THE BOTTOM FRAME'S TABLE
cellColor        = "lightgrey";     // TABLE CELL BG COLOR OF THE DATE CELLS IN THE BOTTOM FRAME
headingCellColor = "white";         // TABLE CELL BG COLOR OF THE WEEKDAY ABBREVIATIONS
headingTextColor = "black";         // TEXT COLOR OF THE WEEKDAY ABBREVIATIONS


//dateColor        = "blue";          // TEXT COLOR OF THE LISTED DATES (1-28+)
//focusColor       = "#ff0000";       // TEXT COLOR OF THE SELECTED DATE (OR CURRENT DATE)
//hoverColor       = "darkred";       // TEXT COLOR OF A LINK WHEN YOU HOVER OVER IT
//fontStyle        = "12pt arial, helvetica";           // TEXT STYLE FOR DATES
//they are in CSS file
headingFontStyle = "bold 12pt arial, helvetica";      // TEXT STYLE FOR WEEKDAY ABBREVIATIONS

// FORMATTING PREFERENCES
bottomBorder  = false;        // TRUE/FALSE (WHETHER TO DISPLAY BOTTOM CALENDAR BORDER)
tableBorder   = 0;            // SIZE OF CALENDAR TABLE BORDER (BOTTOM FRAME) 0=none

//Offset of calander popup from calendar image
calendarTopOffsetFromImage = 15;
calendarLeftOffsetFromImage = 15;

var DateTimeFormat = true;		//"DateTime" if true, else a "Date"

// END USER-EDITABLE SECTION -------------------------------------------------------

// DETERMINE BROWSER BRAND
var isNav = false;
var isIE  = false;

// ASSUME IT'S EITHER NETSCAPE OR MSIE
if (navigator.appName == "Netscape") {
    isNav = true;
}
else {
    isIE = true;
}

// global variable for top frame and bottom frame
var calDocTop;
var calDocBottom;

var promptEngineOrigOnMouseDown; 

// PRE-BUILD PORTIONS OF THE CALENDAR WHEN THIS JS LIBRARY LOADS INTO THE BROWSER
buildCalParts();

// CALENDAR FUNCTIONS BEGIN HERE ---------------------------------------------------

// SET THE INITIAL VALUE OF THE GLOBAL DATE FIELD
function setDateField(formName, dateField) {

    // ASSIGN THE INCOMING FIELD OBJECT TO A GLOBAL VARIABLE
    thisform = document.forms[formName];
    calDateField = thisform[dateField];

    // GET THE VALUE OF THE INCOMING FIELD
    inDate = thisform[dateField].value;

    // SET calDate TO THE DATE IN THE INCOMING FIELD OR DEFAULT TO TODAY'S DATE
    setInitialDate();

    // THE CALENDAR FRAMESET DOCUMENTS ARE CREATED BY JAVASCRIPT FUNCTIONS
    calDocTop    = buildTopCalFrame();
    calDocBottom = buildBottomCalFrame();
    
    if(document.onmousedown)
        promptEngineOrigOnMouseDown = document.onmousedown;
        
    document.onmousedown= clickit;
}


// SET THE INITIAL CALENDAR DATE TO TODAY OR TO THE EXISTING VALUE IN dateField
function setInitialDate() {

    calDate = ParseDate(inDate, DateTimeFormat);
    
    // IF THE INCOMING DATE IS INVALID, USE THE CURRENT DATE
    if (isNaN(calDate)) {

        // ADD CUSTOM DATE PARSING HERE
        // IF IT FAILS, SIMPLY CREATE A NEW DATE OBJECT WHICH DEFAULTS TO THE CURRENT DATE
        calDate = new Date();
    }

    // KEEP TRACK OF THE CURRENT DAY VALUE
    calDay  = calDate.getDate();

    // SET DAY VALUE TO 1... TO AVOID JAVASCRIPT DATE CALCULATION ANOMALIES
    // (IF THE MONTH CHANGES TO FEB AND THE DAY IS 30, THE MONTH WOULD CHANGE TO MARCH
    //  AND THE DAY WOULD CHANGE TO 2.  SETTING THE DAY TO 1 WILL PREVENT THAT)
    calDate.setDate(1);
}

// CREATE THE TOP CALENDAR FRAME
function buildTopCalFrame() {

    // CREATE THE TOP FRAME OF THE CALENDAR
    var calDoc =
        "<div style=\"background:" + topBackground + "\" >" +
        "<div id='IDcalControl'>" +
        "<CENTER>" +
        "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0 WIDTH=100%>" +
        "<TR><TD COLSPAN=7>" +
        "<CENTER>" +
        getMonthSelect() +
        "<INPUT id='INtopYear' VALUE='" + calDate.getFullYear() + "'TYPE=TEXT SIZE=4 MAXLENGTH=4 onChange='setYear()' onfocus='INopenDocumentKey()' onblur='INopenDocumentKey()' onkeyup='INopenDocumentKey()' onKeyDown='if (window.event != null && window.event.keyCode == 13) setYear()'>" +
        "</CENTER>" +
        "</TD>" +
        "</TR>" +
        "<TR>" +
        "<TD COLSPAN=7>" +
        "<CENTER>" +
        "<INPUT " +
        "TYPE=BUTTON id='INtopPreviousYear' VALUE='<<'    onClick='setPreviousYear()'><INPUT " +
        "TYPE=BUTTON id='INtopPreviousMonth' VALUE=' < '   onClick='setPreviousMonth()'><INPUT " +
        "TYPE=BUTTON id='INtopToday' VALUE='" + L_Today + "' onClick='setToday()'><INPUT " +
        "TYPE=BUTTON id='INtopNextMonth' VALUE=' > '   onClick='setNextMonth()'><INPUT " +
        "TYPE=BUTTON id='INtopNextYear' VALUE='>>'    onClick='setNextYear()'>" +
        "</CENTER>" +
        "</TD>" +
        "</TR>" +
        "</TABLE>" +
        "</CENTER>" +
        "</div>" +
        "</div>";

    return calDoc;
}

// CREATE THE BOTTOM CALENDAR FRAME
// (THE MONTHLY CALENDAR)
function buildBottomCalFrame() {
    // START CALENDAR DOCUMENT
    var calDoc = calendarBegin;

    // GET MONTH, AND YEAR FROM GLOBAL CALENDAR DATE
    month   = calDate.getMonth();
    year    = calDate.getFullYear();


    // GET GLOBALLY-TRACKED DAY VALUE (PREVENTS JAVASCRIPT DATE ANOMALIES)
    day     = calDay;

    var i   = 0;

    // DETERMINE THE NUMBER OF DAYS IN THE CURRENT MONTH
    var days = getDaysInMonth();

    // IF GLOBAL DAY VALUE IS > THAN DAYS IN MONTH, HIGHLIGHT LAST DAY IN MONTH
    if (day > days) {
        day = days;
    }

    // DETERMINE WHAT DAY OF THE WEEK THE CALENDAR STARTS ON
    var firstOfMonth = new Date (year, month, 1);

    // GET THE DAY OF THE WEEK THE FIRST DAY OF THE MONTH FALLS ON
    var startingPos  = firstOfMonth.getDay();
    days += startingPos;

    // KEEP TRACK OF THE COLUMNS, START A NEW ROW AFTER EVERY 7 COLUMNS
    var columnCount = 0;

    // MAKE BEGINNING NON-DATE CELLS BLANK
    for (i = 0; i < startingPos; i++) {

        calDoc += blankCell;
	columnCount++;
    }

    // SET VALUES FOR DAYS OF THE MONTH
    var currentDay = 0;
    var dayType    = "weekday";

    // DATE CELLS CONTAIN A NUMBER
    for (i = startingPos; i < days; i++) {

	var paddingChar = "&nbsp;";

        // ADJUST SPACING SO THAT ALL LINKS HAVE RELATIVELY EQUAL WIDTHS
        if (i-startingPos+1 < 10) {
            padding = "&nbsp;&nbsp;";
        }
        else {
            padding = "&nbsp;";
        }

        // GET THE DAY CURRENTLY BEING WRITTEN
        currentDay = i-startingPos+1;

        // SET THE TYPE OF DAY, THE focusDay GENERALLY APPEARS AS A DIFFERENT COLOR
        if (currentDay == day) {
            dayType = "focusDay";
        }
        else {
            dayType = "weekDay";
        }

        // ADD THE DAY TO THE CALENDAR STRING
        calDoc += "<TD align=center style=\"background:" + cellColor + "\" >" +
                  "<a class='" + dayType + "' href='javascript:returnDate(" +
                  currentDay + ")'>" + padding + currentDay + paddingChar + "</a></TD>";

        columnCount++;

        // START A NEW ROW WHEN NECESSARY
        if (columnCount % 7 == 0) {
            calDoc += "</TR><TR>";
        }
    }

    // MAKE REMAINING NON-DATE CELLS BLANK
    for (i=days; i<42; i++)  {

        calDoc += blankCell;
	columnCount++;

        // START A NEW ROW WHEN NECESSARY
        if (columnCount % 7 == 0) {
            calDoc += "</TR>";
            if (i<41) {
                calDoc += "<TR>";
            }
        }
    }

    // FINISH THE NEW CALENDAR PAGE
    calDoc += calendarEnd;

    // RETURN THE COMPLETED CALENDAR PAGE
    return calDoc;
}


// WRITE THE MONTHLY CALENDAR TO THE BOTTOM CALENDAR FRAME
function writeCalendar() {
	// CREATE THE NEW CALENDAR FOR THE SELECTED MONTH & YEAR
    calDocBottom = buildBottomCalFrame();
	//it support ie5 and FF
	if (document.getElementById) { // ns6 & ie
		document.getElementById("bottomDiv").innerHTML = calDocBottom;
	} 
}

// SET THE CALENDAR TO TODAY'S DATE AND DISPLAY THE NEW CALENDAR
function setToday() {

    // SET GLOBAL DATE TO TODAY'S DATE
    calDate = new Date();

    // SET DAY MONTH AND YEAR TO TODAY'S DATE
    var month = calDate.getMonth();
    var year  = calDate.getFullYear();

    // SET MONTH IN DROP-DOWN LIST
    document.getElementById("INtopMonth").selectedIndex = month;

    // SET YEAR VALUE
    document.getElementById("INtopYear").value = year;

	// SET THE DAY VALUE
	calDay = calDate.getDate();

	// DISPLAY THE NEW CALENDAR
    writeCalendar();
}


// SET THE GLOBAL DATE TO THE NEWLY ENTERED YEAR AND REDRAW THE CALENDAR
function setYear() {

    // GET THE NEW YEAR VALUE
    var year  = document.getElementById("INtopYear").value;

    // IF IT'S A FOUR-DIGIT YEAR THEN CHANGE THE CALENDAR
    if (isFourDigitYear(year)) {
        calDate.setFullYear(year);
        writeCalendar();
        //document.getElementById("INtopYear").blur(); it is possiable that user press enter many times
    }
    else {
        // HIGHLIGHT THE YEAR IF THE YEAR IS NOT FOUR DIGITS IN LENGTH
        document.getElementById("INtopYear").focus();
        document.getElementById("INtopYear").select();
    }
    document.onkeydown = function(){return false;}//( if calendar year is onKey, the keypress functions should not be used in the document)
}


// SET THE GLOBAL DATE TO THE SELECTED MONTH AND REDRAW THE CALENDAR
function setCurrentMonth() {

    // GET THE NEWLY SELECTED MONTH AND CHANGE THE CALENDAR ACCORDINGLY
    var month = document.getElementById("INtopMonth").selectedIndex;

    calDate.setMonth(month);
    writeCalendar();
}


// SET THE GLOBAL DATE TO THE PREVIOUS YEAR AND REDRAW THE CALENDAR
function setPreviousYear() {

    var year  = document.getElementById("INtopYear").value;

    if (isFourDigitYear(year) && year > 1000) {
        year--;
        calDate.setFullYear(year);
        document.getElementById("INtopYear").value = year;
        writeCalendar();
    }
}


// SET THE GLOBAL DATE TO THE PREVIOUS MONTH AND REDRAW THE CALENDAR
function setPreviousMonth() {

    var year  = document.getElementById("INtopYear").value;
    if (isFourDigitYear(year)) {
        var month = document.getElementById("INtopMonth").selectedIndex;

        // IF MONTH IS JANUARY, SET MONTH TO DECEMBER AND DECREMENT THE YEAR
        if (month == 0) {
            month = 11;
            if (year > 1000) {
                year--;
                calDate.setFullYear(year);
                document.getElementById("INtopYear").value = year;
            }
        }
        else {
            month--;
        }
        calDate.setMonth(month);
        document.getElementById("INtopMonth").selectedIndex = month;
        writeCalendar();
    }
}


// SET THE GLOBAL DATE TO THE NEXT MONTH AND REDRAW THE CALENDAR
function setNextMonth() {

    var year = document.getElementById("INtopYear").value;

    if (isFourDigitYear(year)) {
        var month = document.getElementById("INtopMonth").selectedIndex;

        // IF MONTH IS DECEMBER, SET MONTH TO JANUARY AND INCREMENT THE YEAR
        if (month == 11) {
            month = 0;
            year++;
            calDate.setFullYear(year);
            document.getElementById("INtopYear").value = year;
        }
        else {
            month++;
        }
        calDate.setMonth(month);
        document.getElementById("INtopMonth").selectedIndex = month;
        writeCalendar();
    }
}


// SET THE GLOBAL DATE TO THE NEXT YEAR AND REDRAW THE CALENDAR
function setNextYear() {

    var year  = document.getElementById("INtopYear").value;
    if (isFourDigitYear(year)) {
        year++;
        calDate.setFullYear(year);
        document.getElementById("INtopYear").value = year;
        writeCalendar();
    }
}


// GET NUMBER OF DAYS IN MONTH
function getDaysInMonth()  {

    var days;
    var month = calDate.getMonth()+1;
    var year  = calDate.getFullYear();

    // RETURN 31 DAYS
    if (month==1 || month==3 || month==5 || month==7 || month==8 ||
        month==10 || month==12)  {
        days=31;
    }
    // RETURN 30 DAYS
    else if (month==4 || month==6 || month==9 || month==11) {
        days=30;
    }
    // RETURN 29 DAYS
    else if (month==2)  {
        if (isLeapYear(year)) {
            days=29;
        }
        // RETURN 28 DAYS
        else {
            days=28;
        }
    }
    return (days);
}


// CHECK TO SEE IF YEAR IS A LEAP YEAR
function isLeapYear (Year) {

    if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
        return (true);
    }
    else {
        return (false);
    }
}


// ENSURE THAT THE YEAR IS FOUR DIGITS IN LENGTH
function isFourDigitYear(year) {

    if (year == null || year.match(/^[0-9]{4}$/) == null){
        document.getElementById("INtopYear").value = calDate.getFullYear();
        document.getElementById("INtopYear").select();
        document.getElementById("INtopYear").focus();
    }
    else {
        return true;
    }
}


// BUILD THE MONTH SELECT LIST
function getMonthSelect() {

    monthArray = new Array(L_January, L_February, L_March, L_April, L_May, L_June,
                           L_July, L_August, L_September, L_October, L_November, L_December);


    // DETERMINE MONTH TO SET AS DEFAULT
    var activeMonth = calDate.getMonth();

    // START HTML SELECT LIST ELEMENT
    monthSelect = "<SELECT id='INtopMonth' onChange='setCurrentMonth()'>";

    // LOOP THROUGH MONTH ARRAY
    for (i in monthArray) {

        // SHOW THE CORRECT MONTH IN THE SELECT LIST
        if (i == activeMonth) {
            monthSelect += "<OPTION SELECTED>" + monthArray[i] + "\n";
        }
        else {
            monthSelect += "<OPTION>" + monthArray[i] + "\n";
        }
    }
    monthSelect += "</SELECT>";

    // RETURN A STRING VALUE WHICH CONTAINS A SELECT LIST OF ALL 12 MONTHS
    return monthSelect;
}


// SET DAYS OF THE WEEK DEPENDING ON LANGUAGE
function createWeekdayList() {

 weekdayArray = new Array(L_Su,L_Mo,L_Tu,L_We,L_Th,L_Fr,L_Sa);


    // START HTML TO HOLD WEEKDAY NAMES IN TABLE FORMAT
    var weekdays = "<TR BGCOLOR='" + headingCellColor + "'>";

    // LOOP THROUGH WEEKDAY ARRAY
    for (i in weekdayArray) {

        weekdays += "<TD style='text-decoration: none; color:" + headingTextColor + "; font: " + headingFontStyle + "' align=center>" + weekdayArray[i] + "</TD>";
    }
    weekdays += "</TR>";

    // RETURN TABLE ROW OF WEEKDAY ABBREVIATIONS TO DISPLAY ABOVE THE CALENDAR
    return weekdays;
}


// PRE-BUILD PORTIONS OF THE CALENDAR (FOR PERFORMANCE REASONS)
function buildCalParts() {

    // GENERATE WEEKDAY HEADERS FOR THE CALENDAR
    weekdays = createWeekdayList();

    // BUILD THE BLANK CELL ROWS 
    blankCell = "<TD align=center style=\"vertical-align:middle; background:" + cellColor + "\" >&nbsp;&nbsp;&nbsp;</TD>";

    // BUILD THE TOP PORTION OF THE CALENDAR PAGE USING CSS TO CONTROL SOME DISPLAY ELEMENTS
    calendarBegin = "";
        // STYLESHEET DEFINES APPEARANCE OF CALENDAR
//        "<STYLE type='text/css'>" +
//        "<!--" +
//\        "TD.heading { text-decoration: none; color:" + headingTextColor + "; font: " + headingFontStyle + "; }" +

//  This style must in CSS file 
//        "A.focusDay:link { color: " + focusColor + "; text-decoration: none; font: " + fontStyle + "; }" +
//        "A.focusDay:hover { color: " + focusColor + "; text-decoration: none; font: " + fontStyle + "; }" +
//        "A.focusDay:visited { color: " + focusColor + "; text-decoration: none; font: " + fontStyle + "; }" +
//        "A.weekday:link { color: " + dateColor + "; text-decoration: none; font: " + fontStyle + "; }" +
//        "A.weekday:hover { color: " + hoverColor + "; font: " + fontStyle + "; }" +
//        "A.weekday:visited { color: " + dateColor + "; text-decoration: none; font: " + fontStyle + "; }" +
//        "-->" +
//        "</STYLE>" +
	//the A link style must in CSS file.
        "<div style=\"background:" + bottomBackground + "\" onload='javascript:self.focus()'>";
    if (document.getElementById) { // ns6 & ie
        calendarBegin +=
            "<DIV ID='bottomDiv'>";
    }
    calendarBegin +=
        "<CENTER>";

        // NAVIGATOR NEEDS A TABLE CONTAINER TO DISPLAY THE TABLE OUTLINES PROPERLY
        if (isNav) {
            calendarBegin +=
                "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=" + tableBorder + " ALIGN=CENTER BGCOLOR='" + tableBGColor + "'><TR><TD>";
        }

        // BUILD WEEKDAY HEADINGS
        calendarBegin +=
            "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=" + tableBorder + " ALIGN=CENTER BGCOLOR='" + tableBGColor + "'>" +
            weekdays +
            "<TR>";


    // BUILD THE BOTTOM PORTION OF THE CALENDAR PAGE
    calendarEnd = "";

        // WHETHER OR NOT TO DISPLAY A THICK LINE BELOW THE CALENDAR
        if (bottomBorder) {
            calendarEnd += "<TR></TR>";
        }

        // NAVIGATOR NEEDS A TABLE CONTAINER TO DISPLAY THE BORDERS PROPERLY
        if (isNav) {
            calendarEnd += "</TD></TR></TABLE>";
        }

        // END THE TABLE AND HTML DOCUMENT
        calendarEnd +=
            "</TABLE>" +
            "</CENTER>";
		if (document.getElementById) { // ns6 & ie
            calendarEnd +=
            "</DIV>";
		}
		calendarEnd +=
            "</div>";
}


// REPLACE ALL INSTANCES OF find WITH replace
// inString: the string you want to convert
// find:     the value to search for
// replace:  the value to substitute
//
// usage:    jsReplace(inString, find, replace);
// example:  jsReplace("To be or not to be", "be", "ski");
//           result: "To ski or not to ski"
//
function jsReplace(inString, find, replace) {

    var outString = "";

    if (!inString) {
        return "";
    }

    // REPLACE ALL INSTANCES OF find WITH replace
    if (inString.indexOf(find) != -1) {
        // SEPARATE THE STRING INTO AN ARRAY OF STRINGS USING THE VALUE IN find
        t = inString.split(find);

        // JOIN ALL ELEMENTS OF THE ARRAY, SEPARATED BY THE VALUE IN replace
        return (t.join(replace));
    }
    else {
        return inString;
    }
}


// JAVASCRIPT FUNCTION -- DOES NOTHING (USED FOR THE HREF IN THE CALENDAR CALL)
function doNothing() {
}


// ENSURE THAT VALUE IS TWO DIGITS IN LENGTH
function makeTwoDigit(inValue) {

    var numVal = parseInt(inValue, 10);

    // VALUE IS LESS THAN TWO DIGITS IN LENGTH
    if (numVal < 10) {

        // ADD A LEADING ZERO TO THE VALUE AND RETURN IT
        return("0" + numVal);
    }
    else {
        return numVal;
    }
}


// SET FIELD VALUE TO THE DATE SELECTED AND CLOSE THE CALENDAR WINDOW
function returnDate(inDay)
{
    // inDay = THE DAY THE USER CLICKED ON
    calDate.setDate(inDay);

    // SET THE DATE RETURNED TO THE USER
    var day           = calDate.getDate();
    var month         = calDate.getMonth()+1;
    var year          = calDate.getFullYear();

    if(promptengine_getIsTwoDigitMonth()) {
        month = makeTwoDigit(month);
    }
    
    if(promptengine_getIsTwoDigitDay()) {
        day = makeTwoDigit(day);
    }

    var outDate = promptengine_getDatePattern();
    outDate = jsReplace(outDate, "Y", year);
    outDate = jsReplace(outDate, "M", month);
    outDate = jsReplace(outDate, "D", day);

    if ( DateTimeFormat == true ) {
        outDate += " ";
        outDate += gHour + ":";  gHour = "00";
        outDate += gMin  + ":";  gMin  = "00";
        outDate += gSec;         gSec  = "00";
    }

    // SET THE VALUE OF THE FIELD THAT WAS PASSED TO THE CALENDAR
    if (calDateField != null && !calDateField.disabled) {
        calDateField.value = outDate;

        // GIVE FOCUS BACK TO THE DATE FIELD
        calDateField.focus();
    }

    // CLOSE THE CALENDAR "WINDOW"
	document.getElementById("INIDcalendarWindow").style.display="none";

}

var gHour = "00";
var gMin  = "00";
var gSec  = "00";
var regDateTimePrompt  = /^(D|d)(A|a)(T|t)(E|e)(T|t)(I|i)(M|m)(E|e) *\( *\d{4} *, *(0?[1-9]|1[0-2]) *, *((0?[1-9]|[1-2]\d)|3(0|1)) *, *([0-1]?\d|2[0-3]) *, *[0-5]?\d *, *[0-5]?\d *\)$/
var regDateTimePromptHTML  = /^ *\d{4} *- *(0?[1-9]|1[0-2]) *- *((0?[1-9]|[1-2]\d)|3(0|1)) *  *([0-1]?\d|2[0-3]) *: *[0-5]?\d *: *[0-5]?\d *$/
function ParseDateTimePrompt(inDate)
{
    if ( regDateTimePrompt.test ( inDate ) )
    {
        var sDate = inDate.substr ( inDate.indexOf("(")+1 );    //move past "DateTime ("
        sDate = sDate.substr ( 0, sDate.lastIndexOf(")") );     //remove trailing ")"
        var dateArray = sDate.split (',');
        var _date = new Date ( dateArray[0], Number(dateArray[1]) - 1, dateArray[2] );
        gHour = dateArray[3]; gMin = dateArray[4]; gSec = dateArray[5];
        return _date;
    }
    
    if ( regDateTimePromptHTML.test ( inDate ) )
    {
        var pos = inDate.indexOf("-");
        var sYear = inDate.substr(0, pos);
        var sMonth = inDate.substr(pos + 1);
        
        pos = sMonth.indexOf("-");
        var sDay = sMonth.substr(pos + 1);
        sMonth = sMonth.substr(0, pos);
        
        pos = sDay.indexOf(" ");
        var sHour = sDay.substr(pos + 1);
        sDay = sDay.substr(0, pos);
        
        pos = sHour.indexOf(":");
        var sMinute = sHour.substr(pos + 1);
        sHour = sHour.substr(0, pos);

        pos = sMinute.indexOf(":");
        var sSecond = sMinute.substr(pos + 1);
        sMinute = sMinute.substr(0, pos);
        
        gHour = sHour; gMin = sMinute; gSec = sSecond;
        return new Date ( sYear, Number(sMonth) - 1, sDay );
    }
    
    return new Date ();
}

var regDatePrompt = /^(D|d)(A|a)(T|t)(E|e) *\( *\d{4} *, *(0?[1-9]|1[0-2]) *, *((0?[1-9]|[1-2]\d)|3(0|1)) *\)$/
var regDatePromptHTML  = /^ *\d{4} *- *(0?[1-9]|1[0-2]) *- *((0?[1-9]|[1-2]\d)|3(0|1)) *$/
function ParseDatePrompt(inDate)
{
    if ( regDatePrompt.test ( inDate ) )
    {
        var sDate = inDate.substr ( inDate.indexOf("(")+1 );    //move past "Date ("
        sDate = sDate.substr ( 0, sDate.lastIndexOf(")") );     //remove trailing ")"
        var dateArray = sDate.split (',');
        return new Date ( dateArray[0], Number(dateArray[1]) - 1, dateArray[2] );
    }
    
    if ( regDatePromptHTML.test ( inDate ) )
    {
        var pos = inDate.indexOf("-");
        var sYear = inDate.substr(0, pos);
        var sMonth = inDate.substr(pos + 1);
        
        pos = sMonth.indexOf("-");
        var sDay = sMonth.substr(pos + 1);
        sMonth = sMonth.substr(0, pos);
        
        return new Date ( sYear, Number(sMonth) - 1, sDay );
    }
    
    return new Date();
}

function ParseDate(inDate, bDateTimeFormat)
{
    var result;
    
    if (bDateTimeFormat == true) {
        result = ParseDateTimePrompt(inDate);
    } else {
        result = ParseDatePrompt(inDate);
    }
    
    return result;
}
//---------------------------------------------------------------
//for write the calendar in page.
var INwidth = 230;
var INheight = 250;//the size(default value)
var INscreenX =0;
var INscreenY =0;//the positon
function INCreateCalendar(titleImagePath, closeImagePath)
{
    if(document.getElementById("INIDcalendarWindow") == null)
    {
        var inlineCalendarWindow =          
            "<div class=\"INcalendarWindow\" id=\"INIDcalendarWindow\" onmousedown=\"INnoClose()\"> " +
            "<iframe src=\"\" scroll=none frameborder=0 style=\"width:100%;height:100%;position:absolute;z-index:-9999\"></iframe> " + 
            "<div class=\"INcalendarTitle\" onmousedown=\"dragStart(event,'INIDcalendarWindow')\"> " +
            "<table  cellspacing=\"0\" cellpadding=\"1\" border=\"0\" style=\"background:url(\'" + titleImagePath + "button_middle_normal.gif\');\"> " + 
            "<tr> " + 
            "<td class=\"INtitleText\">&nbsp;Business Objects</td> " + 
            "<td class=\"INclose\" onclick=\"INcloseWin()\"><img alt=\"Close\" src=\"" + closeImagePath + "errormsg.gif\" height=\"12\" width=\"12\"/></td> " + 
            "</tr> " + 
            "</table> " + 
            "</div> " + 
            "<div class=\"INcalendarTop\" id=\"INIDcalendarTop\">&nbsp;</div> " + 
            "<div class=\"INcalendarBottom\" id=\"INIDcalendarBottom\">&nbsp;</div> " + 
            "</div>";
        if(document.body.insertAdjacentHTML)
        {
            document.body.insertAdjacentHTML("afterBegin", inlineCalendarWindow);
        }
        else
        {
            var calendarWindow = document.createElement("div"); 
            calendarWindow.innerHTML = inlineCalendarWindow;
            document.body.appendChild(calendarWindow);
        }
    }
}
function INwriteCalendar(event,Iwidth, Iheight,IscreenX,IscreenY)
{

	INwidth = Iwidth;
	INheight = Iheight;
	//location and size

	document.getElementById("INIDcalendarWindow").style.width= INwidth;
	document.getElementById("INIDcalendarWindow").style.height= INheight;
	
	document.getElementById("INIDcalendarTop").innerHTML = calDocTop;
	document.getElementById("INIDcalendarBottom").innerHTML = calDocBottom;
	
	setPosition(event);
	
	document.getElementById("INIDcalendarWindow").style.display="block";
	
}
function INcloseWin()
{
    var l=document.getElementById("INIDcalendarWindow")
    if (l) l.style.display="none";
    
    if(promptEngineOrigOnMouseDown) document.onmousedown = promptEngineOrigOnMouseDown;
    
    
}

function setPosition(e)
{
    var calImage;
    if(e.target) {
        calImage = e.target;
    }
    else {
        calImage = e.srcElement;
    }
    
    var calImagePos = findPos(calImage);

    var windowX, windowY;
    var calendarWidth;
    var calendarHeight;
    if (isIE)
    {
        windowX = document.body.clientWidth + document.documentElement.scrollLeft 
            + document.body.scrollLeft;
        windowY = document.body.clientHeight + document.documentElement.scrollTop
            + document.body.scrollTop;

        calendarWidth = 230;
        calendarHeight = 250;
    }
    if (isNav)
    {
        windowX = window.innerWidth + window.scrollX -15;//for firefox scroll bar
        windowY = window.innerHeight + window.scrollY;//left-right scroll bar usually do not has

        calendarWidth = 230 + 8;//for firefox.
        calendarHeight = 250 + 8;
    }
    var posX = calendarLeftOffsetFromImage + calImagePos.x;
    var posY = calendarTopOffsetFromImage + calImagePos.y;
    //location of the window
    //first, check the right bottom
    if( windowX-posX >= calendarWidth && windowY-posY >= calendarHeight)//right bottom
    {
        document.getElementById("INIDcalendarWindow").style.left= posX;
        document.getElementById("INIDcalendarWindow").style.top= posY;
    }
    else if(windowX-posX >= calendarWidth && windowY-posY < calendarHeight)//right bottom, move up
    {
        document.getElementById("INIDcalendarWindow").style.left= posX;
        document.getElementById("INIDcalendarWindow").style.top= windowY - calendarHeight;
    }
    else if(windowX-posX < calendarWidth && windowY-posY >= calendarHeight)//right bottom, move left
    {
        document.getElementById("INIDcalendarWindow").style.left= windowX - calendarWidth;
        document.getElementById("INIDcalendarWindow").style.top= posY;
    }
    //right bottom has no enough space. try to show it left bottom (right, bottom is not enough)
    else if(windowY > calendarHeight && posX - calendarLeftOffsetFromImage > calendarWidth)//left bottom(left enough)
    {
        document.getElementById("INIDcalendarWindow").style.left= posX - calendarLeftOffsetFromImage - calendarWidth;
        document.getElementById("INIDcalendarWindow").style.top= windowY - calendarHeight;
    }
    //left bottom has no enough space. try to show it top (left, right, bottom is not enough)
    else if(windowX > calendarWidth && posY - calendarTopOffsetFromImage >= calendarHeight)//right top
    {
        document.getElementById("INIDcalendarWindow").style.left= windowX - calendarWidth;
        document.getElementById("INIDcalendarWindow").style.top= posY - calendarTopOffsetFromImage - calendarHeight;
    }
    else//right bottom has no enough space. show it anyway
    {
        document.getElementById("INIDcalendarWindow").style.left= windowX - calendarWidth;//move left
        document.getElementById("INIDcalendarWindow").style.top= windowY - calendarHeight;//move up.
    }    
}

function findPos(obj) {
    
    var offsetLeft = obj.offsetLeft;
    var offsetTop  = obj.offsetTop;
    
    while(obj.offsetParent && (obj.offsetParent.style.position == '' || obj.offsetParent.style.position == 'fixed'))
    {
        obj = obj.offsetParent;
        offsetLeft += obj.offsetLeft;
        offsetTop  += obj.offsetTop;
    }
    
    return { x : offsetLeft , y : offsetTop};
}


//--------------------------drag-functions--------------------------------
var dragObject = new Object();
dragObject.zIndex = 0;

function dragStart(event, id)
{
  var el;
  var x, y;

  if (id)//notice: the id must be set!!
  {
    dragObject.elNode = document.getElementById(id);
  }
  
  if (isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (isNav) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  dragObject.cursorStartX = x;
  dragObject.cursorStartY = y;
  dragObject.elStartLeft  = parseInt(dragObject.elNode.style.left, 10);
  dragObject.elStartTop   = parseInt(dragObject.elNode.style.top,  10);

  if(isIE)
  {
	if (isNaN(dragObject.elStartLeft)) dragObject.elStartLeft = INscreenX + INwidth/2 + 20;//original position
	if (isNaN(dragObject.elStartTop))  dragObject.elStartTop  = INscreenY - INheight + 20;//+20 make it look better
  }
  else
  {
    if (isNaN(dragObject.elStartLeft)) dragObject.elStartLeft = INscreenX;//original position
    if (isNaN(dragObject.elStartTop))  dragObject.elStartTop  = INscreenY;// make it look better
  }	

  dragObject.elNode.style.zIndex = ++dragObject.zIndex;

  if (isIE) {
    document.attachEvent("onmousemove", dragBegin);
    document.attachEvent("onmouseup",   dragEnd);
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (isNav) {
    document.addEventListener("mousemove", dragBegin,   true);
    document.addEventListener("mouseup",   dragEnd, true);
    event.preventDefault();
  }
}

function dragBegin(event)//mouse move
{
  var x, y;
  if (isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (isNav) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  dragObject.elNode.style.left = (dragObject.elStartLeft + x - dragObject.cursorStartX) + "px";
  dragObject.elNode.style.top  = (dragObject.elStartTop  + y - dragObject.cursorStartY) + "px";//set the position

  if (isIE) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (isNav)
    event.preventDefault();
}

function dragEnd(event)//mouse stop
{
	dragObject.elNode = null;
	if (isIE)
	{
		document.detachEvent("onmousemove", dragBegin);
		document.detachEvent("onmouseup",   dragEnd);
	}
	if (isNav)
	{
		document.removeEventListener("mousemove", dragBegin,   true);
		document.removeEventListener("mouseup",   dragEnd, true);
	}
}
//----------for click close calendar---------------------------------------------------------------
var CloseIt = true;
function clickit()
{
	if(CloseIt)
	{
		if(document.getElementById("INIDcalendarWindow")!= null)//should have the calendar div
		{
			INcloseWin();
		}
	}
	else
	{
		CloseIt = true;
	}
	
}
function INnoClose()
{
	CloseIt = false;
}
//---for calendar onKey functions( if calendar year is onKey, the keypress functions should not be used in the document)----
function INopenDocumentKey()
{
	document.onkeydown = function(){return true;}
}
 /* Crystal Decisions Confidential Proprietary Information */
