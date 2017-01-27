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

_default="$LOC_PALETTE_DEFAULT$"
_black="$LOC_PALETTE_BLACK$"
_brown="$LOC_PALETTE_BROWN$"
_oliveGreen="$LOC_PALETTE_OLIVEGREEN$"
_darkGreen="$LOC_PALETTE_DARKGREEN$"
_darkTeal="$LOC_PALETTE_DARKTEAL$"
_navyBlue="$LOC_PALETTE_NAVYBLUE$"
_indigo="$LOC_PALETTE_INDIGO$"
_darkGray="$LOC_PALETTE_DARKGRAY$"
_darkRed="$LOC_PALETTE_DARKRED$"
_orange="$LOC_PALETTE_ORANGE$"
_darkYellow="$LOC_PALETTE_DARKYELLOW$"
_green="$LOC_PALETTE_GREEN$"
_teal="$LOC_PALETTE_TEAL$"
_blue="$LOC_PALETTE_BLUE$"
_blueGray="$LOC_PALETTE_BLUEGRAY$"
_mediumGray="$LOC_PALETTE_MEDIUMGRAY$"
_red="$LOC_PALETTE_RED$"
_lightOrange="$LOC_PALETTE_LIGHTORANGE$"
_lime="$LOC_PALETTE_LIME$"
_seaGreen="$LOC_PALETTE_SEAGREEN$"
_aqua="$LOC_PALETTE_AQUA$"
_lightBlue="$LOC_PALETTE_LIGHTBLUE$"
_violet="$LOC_PALETTE_VIOLET$"
_gray="$LOC_PALETTE_GRAY$"
_magenta="$LOC_PALETTE_MAGENTA$"
_gold="$LOC_PALETTE_GOLD$"
_yellow="$LOC_PALETTE_YELLOW$"
_brightGreen="$LOC_PALETTE_BRIGHTGREEN$"
_cyan="$LOC_PALETTE_CYAN$"
_skyBlue="$LOC_PALETTE_SKYBLUE$"
_plum="$LOC_PALETTE_PLUM$"
_lightGray="$LOC_PALETTE_LIGHTGRAY$"
_pink="$LOC_PALETTE_PINK$"
_tan="$LOC_PALETTE_TAN$"
_lightYellow="$LOC_PALETTE_LIGHTYELLOW$"
_lightGreen="$LOC_PALETTE_LIGHTGREEN$"
_lightTurquoise="$LOC_PALETTE_LIGHTTURQUOISE$"
_paleBlue="$LOC_PALETTE_PALEBLUE$"
_lavender="$LOC_PALETTE_LAVENDER$"
_white="$LOC_PALETTE_WHITE$"
_lastUsed="$LOC_PALETTE_LASTUSED$"
_moreColors="$LOC_PALETTE_MORECOLORS$"

_month=new Array

_month[0]="$LOC_CAL_JANUARY$"
_month[1]="$LOC_CAL_FEBRUARY$"
_month[2]="$LOC_CAL_MARCH$"
_month[3]="$LOC_CAL_APRIL$"
_month[4]="$LOC_CAL_MAY$"
_month[5]="$LOC_CAL_JUNE$"
_month[6]="$LOC_CAL_JULY$"
_month[7]="$LOC_CAL_AUGUST$"
_month[8]="$LOC_CAL_SEPTEMBER$"
_month[9]="$LOC_CAL_OCTOBER$"
_month[10]="$LOC_CAL_NOVEMBER$"
_month[11]="$LOC_CAL_DECEMBER$"

_day=new Array
_day[0]="$LOC_CAL_DAY_0$"
_day[1]="$LOC_CAL_DAY_1$"
_day[2]="$LOC_CAL_DAY_2$"
_day[3]="$LOC_CAL_DAY_3$"
_day[4]="$LOC_CAL_DAY_4$"
_day[5]="$LOC_CAL_DAY_5$"
_day[6]="$LOC_CAL_DAY_6$"

_today="$LOC_CAL_TODAY$"

_AM="$LOC_CAL_AM$"
_PM="$LOC_CAL_PM$"

_closeDialog="$LOC_DIALOG_CLOSE$"

_lstMoveUpLab="$LOC_MOVEUP_LAB$"
_lstMoveDownLab="$LOC_MOVEDOWN_LAB$"
_lstMoveLeftLab="$LOC_MOVELEFTLAB$" 
_lstMoveRightLab="$LOC_MOVERIGHT_LAB$"
_lstNewNodeLab="$LOC_NEWNODE_LAB$"
_lstAndLabel="$LOC_AND_LAB$"
_lstOrLabel="$LOC_OR_LAB$"
_lstSelectedLabel="$LOC_SELECTED_LAB$"
_lstQuickFilterLab="$LOC_QUICKFILTER_LAB$"

_openMenuPart1="$LOC_MENU_OPEN_LAB1$"
_openMenuPart2="$LOC_MENU_OPEN_LAB2$"
_openCalendarLab="$LOC_CALENDAR_OPEN_LAB$"

_scroll_first_tab="$LOC_TABBAR_FIRST_LAB$"
_scroll_previous_tab="$LOC_TABBAR_PREVIOUS_LAB$"
_scroll_next_tab="$LOC_TABBAR_NEXT_LAB$"
_scroll_last_tab="$LOC_TABBAR_LAST_LAB$"

_expandedLab="$LOC_EXPANDED_LAB$"
_collapsedLab="$LOC_COLLAPSED_LAB$"
_selectedLab="$LOC_SELECTED_LAB$"

_expandNode="$LOC_EXPAND_NODE$"
_collapseNode="$LOC_COLLAPSE_NODE$"

_checkedPromptLab="$LOC_SET_PROMPT_LAB$"
_nocheckedPromptLab="$LOC_NOTSET_PROMPT_LAB$"
_selectionPromptLab="$LOC_SELECTION_PROMPT_LAB$"
_noselectionPromptLab="$LOC_NOSELECTION_PROMPT_LAB$"

_lovTextFieldLab="$LOC_LOV_TEXTFIELD_LAB$"
_lovCalendarLab="$LOC_LOV_CALENDAR_LAB$"
_lovPrevChunkLab="$LOC_LOV_PREV_CHUNK_LAB$"
_lovNextChunkLab="$LOC_LOV_NEXT_CHUNK_LAB$"
_lovComboChunkLab="$LOC_LOV_COMBO_CHUNK_LAB$"
_lovRefreshLab="$LOC_LOV_REFRESH_LAB$"
_lovSearchFieldLab="$LOC_LOV_SEARCHFIELD_LAB$"
_lovSearchLab="$LOC_LOV_SEARCH_LAB$"
_lovNormalLab="$LOC_LOV_NORMAL_LAB$"
_lovMatchCase="$LOC_LOV_MATCHCASE_LAB$"
_lovRefreshValuesLab="$LOC_LOV_REFRESHVALUES_LAB$"

_calendarNextMonthLab="$LOC_CALENDAR_NEXT_MONTH_LAB$"
_calendarPrevMonthLab="$LOC_CALENDAR_PREV_MONTH_LAB$"
_calendarNextYearLab="$LOC_CALENDAR_NEXT_YEAR_LAB$"
_calendarPrevYearLab="$LOC_CALENDAR_PREV_YEAR_LAB$"
_calendarSelectionLab="$LOC_CALENDAR_SELECTION_LAB$"

_menuCheckLab="$LOC_MENU_CHECK_LAB$"
_menuDisableLab="$LOC_MENU_DISABLE_LAB$"

_RGBTxtBegin= "$LOC_VIEWER_COLOR_ICON_RGB_BEGIN$"
_RGBTxtEnd= "$LOC_VIEWER_COLOR_ICON_RGB_END$"

_helpLab="$LOC_ICON_HELP_LAB$"

_waitTitleLab="$LOC_WAIT_TITLE_LAB$"
_cancelButtonLab="$LOC_CANCEL_BUTTON_LAB$"

_modifiers= new Array
_modifiers[0]="$LOC_VIEWER_CTRL$"
_modifiers[1]="$LOC_VIEWER_SHIFT$"
_modifiers[2]="$LOC_VIEWER_ALT$"

_bordersMoreColorsLabel="$LOC_BORDERS_MORE$"
_bordersTooltip=new Array
_bordersTooltip[0]="$LOC_BORDERS_NONE$"
_bordersTooltip[1]="$LOC_BORDERS_LEFT$"
_bordersTooltip[2]="$LOC_BORDERS_RIGHT$"
_bordersTooltip[3]="$LOC_BORDERS_BOTTOM$"
_bordersTooltip[4]="$LOC_BORDERS_MEDIUMBOTTOM$"
_bordersTooltip[5]="$LOC_BORDERS_THICKBOTTOM$"
_bordersTooltip[6]="$LOC_BORDERS_TOPBOTTOM$"
_bordersTooltip[7]="$LOC_BORDERS_TOP_MEDIUMBOTTOM$"
_bordersTooltip[8]="$LOC_BORDERS_TOP_THICKBOTTOM$"
_bordersTooltip[9]="$LOC_BORDERS_ALL$"
_bordersTooltip[10]="$LOC_BORDERS_ALLMEDIUM$"
_bordersTooltip[11]="$LOC_BORDERS_ALLTHICK$"