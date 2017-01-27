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

File: tabs.js
=============================================================
*/

_boAllTabs=new Array

// ================================================================================
// ================================================================================
//
// OBJECT newTabWidget (Constructor)
//
// Display a sing tab. It has a selected and an unselected
// State.
//
// ================================================================================
// ================================================================================

function newTabWidget(id,isTop,name,cb,value,icon,iconW,iconH,iconOffX,iconOffY,dblclick,alt)
// id       : [String]   the tab id for DHTML processing
// isTop    : [boolean]  change the tab look. true for top tabs
// name     : [String]   tab label
// cb       : [Function] callback pointer, called when clicking on the tab
// value    : [String - optional] a value that is used to find it again
// icon     : [String - optional] an image URL
// iconW    : [int - optional] displayed image width
// iconH    : [int - optional] displayed image height
// iconOffX : [int - optional] x offset in the icon (for combined images)
// iconOffY : [int - optional] y offset in the icon (for combined images)
// Return   : The new object
{
	// Parent class
	var o=newWidget(id)

	// Members
	o.isTop=isTop
	o.isSelected=false
	
	// Other layers
	o.lnkLayer=null
	o.leftImgLayer=null
	o.rightImgLayer=null
	o.midImgLayer=null
	o.imgImgLayer=null
	o.iconLayer=null
	o.tabBar=null

	// Methods
	o.getHTML=TabWidget_getHTML
	o.select=TabWidget_select
	o.change=TabWidget_change
	o.changeContent=TabWidget_changeContent
	
	// Set content
	o.change(name,cb,value,icon,iconW,iconH,iconOffX,iconOffY,dblclick,alt)
	
	// For further retrieval
	_boAllTabs[id]=o
	return o
}

// ================================================================================

function TabWidget_getHTML()
// Write the tab widget HTML
// return [String] the HTML
{
	var o=this
	var y=o.isSelected?0:72
	if (!o.isTop)
		y+=144
	
	var cls="thumbtxt"+(o.isSelected?"sel":"")
	var cb=_codeWinName+".TabWidget_clickCB('"+o.id+"');return false"
	var dblcb=_codeWinName+".TabWidget_dblclickCB('"+o.id+"');return false"
	var keycb=_codeWinName+".TabWidget_keyDownCB('"+o.id+"',event);"
	var menu=_codeWinName+".TabWidget_contextMenuCB('"+o.id+"',event);return false"
	var icon=o.icon?o.icon:_skin+"../transp.gif"
	var iconTDWidth=o.icon?3:0
	
	return '<table onmouseover="return true" onclick="'+cb+'" id="'+this.id+'" ondblclick="'+dblcb+'" onkeydown="'+keycb+'" oncontextmenu="'+menu+'" id="'+this.id+'" style="cursor:'+_hand+'" cellspacing="0" cellpadding="0" border="0"><tbody><tr valign="middle" height="24">'+
		'<td width="15">'+imgOffset(_skin+'tabs.gif',15,24,0,y,"tabWidgetLeft_"+o.id)+'</td>'+
		'<td id="tabWidgetImg_'+o.id+'" style="' +(o.isTop?'padding-top:2px;':'padding-bottom:2px;')+ ' padding-right:'+iconTDWidth+'px; '+backImgOffset(_skin+"tabs.gif",0,y+24)+'" width="'+(o.iconW+iconTDWidth)+'" align="left">'+imgOffset(icon,o.iconW,o.iconH,o.iconOffX,o.iconOffY,"tabWidgetIcon_"+o.id,null,o.iconAlt)+'</td>'+
		'<td  width="50" id="tabWidgetMid_'+o.id+'" style="' +(o.isTop?'padding-top:3px;':'padding-bottom:3px;') +backImgOffset(_skin+"tabs.gif",0,y+24)+'"><span style="white-space:nowrap">'+lnk(convStr(o.name,true),null,cls,"tabWidgetLnk_"+o.id)+'</span></td>'+
		'<td width="15">'+imgOffset(_skin+'tabs.gif',15,24,0,y+48,"tabWidgetRight_"+o.id)+'</td>'+
	'</tr></tbody></table>'
}

// ================================================================================

function TabWidget_clickCB(id)
// Global function, internal click event handler for the Tab widget. It calls a 
// id [String] the tab id
// delayed function for fixing some browers bugs
// return void
{
	setTimeout("TabWidget_delayedClickCB('"+id+"')",1)
}

// ================================================================================

function TabWidget_dblclickCB(id)
// id [String] the tab id
// return void
{
	setTimeout("TabWidget_delayedDblClickCB('"+id+"')",1)
}

// ================================================================================


function TabWidget_keyDownCB(id,e)
// Global function, internal onkeydown event handler for the Tab widget. It calls a 
// id [String] the tab id and event
{
	var k=eventGetKey(e);	
	//be careful ! usefull for dialog box close by Enter ou Escape keypressed
	if(eventGetKey(e) == 13)//Enter
	{
		eventCancelBubble(e);
	}
}
// ================================================================================


function TabWidget_contextMenuCB(id,e)
// id [String] the tab id
// e  [event] the event
// return void
{		
	if (_ie)
		e=_curWin.event
				
	var tab=_boAllTabs[id], tabbar = tab.tabBar
	
	if ((tab)&&(tab.cb))
		tab.cb()
		
	if ((tabbar)&& (tabbar.showMenu))	
		tabbar.showMenu(e)	
}

// ================================================================================

function TabWidget_delayedClickCB(id)
// Global function, internal click event handler for the Tab widget. Calls the
// user defined callback of the TabWidget, if any
// id [String] the tab id
// return void
{
	var tab=_boAllTabs[id]
	if ((tab)&&(tab.cb))
		tab.cb()
}

// ================================================================================

function TabWidget_delayedDblClickCB(id)
// Global function, Delayed internal click event handler for the Tab widget. Calls the
// user defined callback of the TabWidget, if any
// id [String] the tab id
// return void
{
	var tab=_boAllTabs[id]
	
	if ((tab)&& (tab.dblclick))
		tab.dblclick()
}

// ================================================================================

function TabWidget_changeContent(changeOnlySelection)
// Select or unselects the tab widget
// sel [boolean] : select if true
// return void
{
	var o=this

	// Get layers
	if (o.lnkLayer==null)
	{
		o.lnkLayer=getLayer("tabWidgetLnk_"+o.id)
		o.leftImgLayer=getLayer("tabWidgetLeft_"+o.id)
		o.rightImgLayer=getLayer("tabWidgetRight_"+o.id)
		o.midImgLayer=getLayer("tabWidgetMid_"+o.id)
		o.imgImgLayer=getLayer("tabWidgetImg_"+o.id)
		o.iconLayer=getLayer("tabWidgetIcon_"+o.id)
	}

	// Change icon and text
	if (!changeOnlySelection)
	{
		o.lnkLayer.innerHTML=convStr(o.name,true)
		changeOffset(o.iconLayer,o.iconOffX,o.iconOffY,o.icon?o.icon:_skin+"../transp.gif")
		o.iconLayer.alt=o.iconAlt

		//var parSty=o.iconLayer.parentNode.style
		o.iconLayer.style.width=""+o.iconW+"px"
		o.iconLayer.style.height=""+o.iconH+"px"
		
		var iconTDWidth=o.icon?3:0,imgL=o.imgImgLayer
		imgL.style.paddingRight=""+iconTDWidth+"px"

		imgL.style.width=""+(iconTDWidth+(((o.icon!=null)&&(o.iconW!=null))?o.iconW:0))+"px"
		if (_moz&&!_saf)
			imgL.width=(iconTDWidth+(((o.icon!=null)&&(o.iconW!=null))?o.iconW:0))
	}

	// Calculate positions
	var y=o.isSelected?0:72
	if (!o.isTop)
		y+=144

	changeOffset(o.leftImgLayer,0,y)
	changeOffset(o.midImgLayer,0,y+24)
	changeOffset(o.imgImgLayer,0,y+24)
	changeOffset(o.rightImgLayer,0,y+48)

	o.lnkLayer.className="thumbtxt"+(o.isSelected?"sel":"")
}

// ================================================================================

function TabWidget_select(sel)
// Select or unselects the tab widget
// sel [boolean] : select if true
// return : void
{
	var o=this
	o.isSelected=sel
	if (o.layer!=null)
		o.changeContent(true)
}

// ================================================================================

function TabWidget_change(name,cb,value,icon,iconW,iconH,iconOffX,iconOffY,dblclick,alt)
// Change the tabs parameters (name, callbacks, icon)
// name     : [String]   tab label
// cb       : [Function] callback pointer, called when clicking on the tab
// value    : [String - optional] a value that is used to find it again
// icon     : [String - optional] an image URL
// iconW    : [int - optional] displayed image width
// iconH    : [int - optional] displayed image height
// iconOffX : [int - optional] x offset in the icon (for combined images)
// iconOffY : [int - optional] y offset in the icon (for combined images)
// return   : void
{
	var o=this

	// Set new values
	if (name!=null)
		o.name=name
	if (cb!=null)
		o.cb=cb
	if (dblclick!=null)
		o.dblclick=dblclick
	if (value!=null)	
		o.value=value
	if (icon!=null)
		o.icon=icon
	o.iconW=iconW?iconW:0
	o.iconH=iconH?iconH:0
	o.iconOffX=iconOffX?iconOffX:0
	o.iconOffY=iconOffY?iconOffY:0
	if (alt!=null)
		o.iconAlt=alt
	
	// If the widget is initialized, update it
	if (o.layer!=null)
		o.changeContent(false)
}

// ================================================================================
// ================================================================================
//
// OBJECT newTabBarWidget (Constructor)
//
// Display a tabs bar. When using icons, these must be all in the same combined
// image
//
// ================================================================================
// ================================================================================

function newTabBarWidget(id,isTop,cb,st,dblclick,beforeShowMenu,showIcn)
// id       : [String]   the tab id for DHTML processing
// isTop    : [boolean]  change the tab look. true for top tabs
// cb       : [Function - optional] callback pointer, called when clicking on a tab
// st       : [String - optional] additional style in the tag
// showIcn  : [boolean]  show the navigation icon (default is false)
// Return   : The new object
{
	// Parent class
	var o=newWidget(id)
	var t

	// Members
	o.isTop=isTop
	o.cb=cb
	o.dblclick=dblclick
	o.menu=newMenuWidget("menu_"+id,null,beforeShowMenu)	
	o.st=st
	o.counter=0
	o.items=new Array
	o.selIndex=-1
	o.leftLimit=0
	o.trLayer=null
	o.showIcn=showIcn==null?false:showIcn
	t=o.firstIcn=newIconWidget("firstIcn_"+id,_skin+"scroll_icon.gif",TabBarWidget_firstCB,null,_scroll_first_tab,5,8,0,0,0,8)
	t.par=o
	t.margin=0
	t.allowDblClick=true
	t=o.previousIcn=newIconWidget("previousIcn_"+id,_skin+"scroll_icon.gif",TabBarWidget_prevCB,null,_scroll_previous_tab,5,8,7,0,7,8)
	t.par=o
	t.margin=0
	t.allowDblClick=true
	t=o.nextIcn=newIconWidget("nextIcn_"+id,_skin+"scroll_icon.gif",TabBarWidget_nextCB,null,_scroll_next_tab,5,8,13,0,13,8)
	t.par=o
	t.margin=0
	t.allowDblClick=true
	t=o.lastIcn=newIconWidget("lastIcn_"+id,_skin+"scroll_icon.gif",TabBarWidget_lastCB,null,_scroll_last_tab,5,8,21,0,21,8)
	t.par=o
	t.margin=0
	t.allowDblClick=true
	o.showContextMenuAllowed=true
	
	// Methods
	o.oldInit=o.init
	o.init=TabBarWidget_init
	o.getHTML=TabBarWidget_getHTML
	o.add=TabBarWidget_add
	o.remove=TabBarWidget_remove
	o.removeAll=TabBarWidget_removeAll
	o.select=TabBarWidget_select	
	o.getSelection=TabBarWidget_getSelection	
	o.getMenu=TabBarWidget_getMenu
	o.showMenu=TabBarWidget_showMenu
	o.showTab=TabBarWidget_showTab
	o.getCount=TabBarWidget_getCount
	o.oldResize=o.resize
	o.resize=TabBarWidget_resize
	o.getItemXPos=TabBarWidget_getItemXPos
	o.scroll=TabBarWidget_scroll
	o.setIconState=TabBarWidget_setIconState
	o.setShowContextMenuAllowed=TabBarWidget_setShowContextMenuAllowed
	
	return o
}

// ================================================================================

function TabBarWidget_init()
// init the widget
// return void
{
	var o=this,items=o.items
	o.oldInit()
	
	if (o.showIcn)
	{
		o.firstIcn.init()
		o.previousIcn.init()
		o.nextIcn.init()
		o.lastIcn.init()
	}
	
	o.trLayer=getLayer("tr_"+o.id)	
	o.tabsLayer=getLayer("tabs_"+o.id)
	
	for (var i in items)
	{
		var it=items[i]
		it.init()
		it.select(i==o.selIndex)
	}	
}

// ================================================================================

function TabBarWidget_getSelection()
// get the selection
// return an object (or null if no selection). Object fields
//    - index [int] : the selection index
//    - value [String] : value of the select object
{
	var o=this,index=o.selIndex
	if (index>=0)
	{
		var obj=new Object
		obj.index=index
		obj.valueOf=o.items[index].value
		obj.name=o.items[index].name
		return obj
	}
	else
		return null
}

// ================================================================================

function TabBarWidget_getHTML()
// Write the tab bar widget HTML
// return [String] the HTML
{
	var o=this,items=o.items,len=items.length
	var s= '<div id="'+this.id+'" style="height:24px;overflow:hidden;'+(o.st?o.st:'')+'">'
	s+='<table cellspacing="0" cellpadding="0" border="0"><tbody><tr valign="top" height="24">'
	
	if (o.showIcn)
	{
		s+='<td><table class="palette" cellspacing="0" cellpadding="0" border="0"><tbody><tr>'
		s+='<td>'+o.firstIcn.getHTML()+'</td>'	
		s+='<td>'+o.previousIcn.getHTML()+'</td>'
		s+='<td>'+o.nextIcn.getHTML()+'</td>'
		s+='<td>'+o.lastIcn.getHTML()+'</td>'
		s+='</tr></tbody></table></td>'
	}
	
	s+='<td><div style="overflow:'+(true?'hidden':'scroll')+'" id="tabs_'+this.id +'"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr id="tr_'+this.id +'">'
	for (var i in items)
		s+='<td>'+items[i].getHTML()+'</td>'
	s+='</tr></tbody></table></div></td>'
	
	s+='</tr></tbody></table></div>'
	
	return s	
}

// ================================================================================

function TabBarWidget_select(index)
// Select an elemnt by index
// index : [int] index to select (-1 = last)
// return : void
{
	var o=this,items=o.items,len=items.length
	if (index==-1) index=len-1
	
	if ((index>=0)&&(index<len))
	{
		if ((o.selIndex>=0)&&(o.selIndex!=index)&&(o.selIndex<len))
			items[o.selIndex].select(false)
	
		o.selIndex=index
		items[index].select(true)
		
		o.scroll(o.selIndex)
	}
}

// ================================================================================

function TabBarWidget_resize(w,h)
// Resizes the TabBarWidget
// w	[int]	The new tabBarWidget width
// h	[int]	The new tabBarWidget height
{
	var o=this
	var d=isHidden(o.layer)

	if (d&_moz&&!_saf)
		o.setDisplay(false)
		
	o.oldResize(w,h)
	if (w!=null)
		o.tabsLayer.style.width=""+Math.max(0,w-54)

	if (d&_moz&&!_saf)
		o.setDisplay(true)
		
	o.setIconState()
}

// ================================================================================

function TabBarWidget_showTab(index,show)
{
	var o=this,items=o.items,len=items.length
	if ((index>=0)||(index<len))
		items[index].setDisplay(show)
}

// ================================================================================

function TabBarWidget_add(name, value, idx, icon, iconW,iconH,iconOffX,iconOffY,alt)
// Add an element in the tab bar
// name     : [String]   tab label
// value    : [String - optional] a value that is used to find it again
// icon     : [String - optional] an image URL
// iconW    : [int - optional] displayed image width
// iconH    : [int - optional] displayed image height
// iconOffX : [int - optional] x offset in the icon (for combined images)
// iconOffY : [int - optional] y offset in the icon (for combined images)
// Returns  : the new TabWidget object
{
	var o=this,counter=o.counter++
	var obj=newTabWidget(o.id+"_tab"+counter,o.isTop,name,TabBarWidget_itemClick,value,icon,iconW,iconH,iconOffX,iconOffY,TabBarWidget_itemDblClick,alt)
	obj.tabBar=o
	obj.idx=counter
	arrayAdd(o,"items",obj,idx)		
	
	var l=o.trLayer	
	if(l!=null)
	{		
		var node=document.createElement("td")
		node.innerHTML=obj.getHTML()
		l.appendChild(node)
		
		obj.init()
	}

	return obj
}

// ================================================================================

function TabBarWidget_remove(idx)
{
	var o=this,items=o.items,len=items.length

	if ((idx>=0)&&(idx<len))
	{
		var elem=items[idx]
		var l=elem.layer

		arrayRemove(o,"items",idx)
		items=o.items
		len=items.length

		if (l!=null)
		{
			l=l.parentNode
			l.parentNode.removeChild(l)
		}

		if (o.selIndex>idx) o.select(o.selIndex-1)
		else if ((o.selIndex==idx) && (len>0))
			o.select(Math.min(idx,len-1))
	}
}

// ================================================================================
function TabBarWidget_removeAll()
{
	var o=this,items=o.items, len= items.length	
	for (var i=len-1;i>=0;i--)
		o.remove(i)			
}

// ================================================================================

function TabBarWidget_itemClick()
// Internal callback when an item is selected
// Returns  void
{
	var o=this.tabBar,items=o.items,len=items.length,index=-1
	for (var i=0;i<len;i++)
	{
		if (items[i].idx==this.idx)
		{
			o.select(i)
			index=i
			break
		}
	}
	
	if (o.cb)
		o.cb(index)
}

// ================================================================================

function TabBarWidget_itemDblClick()
// Internal callback when a double click is done
// Returns  void
{
	
	var o=this.tabBar,items=o.items,len=items.length,index=-1
	for (var i=0;i<len;i++)
	{
		if (items[i].idx==this.idx)
		{					
			index=i
			break
		}
	}
	
	if (o.dblclick)
		o.dblclick(index)
}

// ================================================================================

function TabBarWidget_getMenu()
// get the menu
// return [MenuWidget] the menu
{
	return this.menu
}

// ================================================================================

function TabBarWidget_setShowContextMenuAllowed(b)
{
	this.showContextMenuAllowed=b
}

// ================================================================================

function TabBarWidget_showMenu(e)
// Show the menu
// e	: event
// return void
{
	if (this.showContextMenuAllowed==false)
		return
		
	if (_ie)
		e=event

	this.menu.show(true,eventGetX(e),eventGetY(e))	
}

// ================================================================================

function TabBarWidget_getCount()
// Get the number of tabs
// return [int] the number of tabs
{
	return this.items.length
}

// ================================================================================

function TabBarWidget_scroll(step,destItem)
// Scroll the TabBarWidget in order for the <destIndex> tab to be visible
{
	var o=this

	if (o.tabsLayer==null)
		return
			
	var tabsl=o.tabsLayer
	var tabsSL=tabsl.scrollLeft,tabsOW=tabsl.offsetWidth,tabsSW=tabsl.scrollWidth,SLMax=tabsSW-tabsOW

	//alert("AVANT scroll\nstep="+step+"\no.leftLimit="+o.leftLimit+"\ntabsSL="+tabsSL+"\nSLMax="+SLMax)
	
	// Scroll
	if (step=='first')		// go to first tab
	{
		tabsl.scrollLeft=tabsSL=0
		o.leftLimit=0
	}
	if (step=='previous')	// go to previous tab
	{	
		o.leftLimit=o.leftLimit-1	
		var x=o.getItemXPos(o.leftLimit)
		tabsl.scrollLeft=tabsSL=x		
	}
	if (step=='next')		// go to next tab
	{
		if (o.leftLimit>o.getCount()-1)
			return
		o.leftLimit+=1
		var x=o.getItemXPos(o.leftLimit)
		if (x<SLMax)
			tabsl.scrollLeft=tabsSL=x
		else
			tabsl.scrollLeft=tabsSL=SLMax
	}
	if (step=='last')		// go to last tab
	{		
		for (var i=0;i<o.getCount();i++)
		{
			var x=o.getItemXPos(i);
			if (x>SLMax)
				break;
		}
		tabsl.scrollLeft=tabsSL=Math.max(0,SLMax)
		o.leftLimit=i
	}
	if (step==null)			// go to the specified <destItem>
	{
		var x=getItemXPos(destItem);
		if (x<SLMax)
			tabsl.scrollLeft=tabsSL=x
		else
			tabsl.scrollLeft=tabsSL=SLMax
		for (var i=0;i<o.getCount();i++)
		{
			var x=o.getItemXPos(i)
			if (x>SLMax)
				break;
		}
		o.leftLimit=i
	}
	
	o.setIconState()

	//alert("AVANT scroll\nstep="+step+"\no.leftLimit="+o.leftLimit+"\ntabsSL="+tabsSL+"\nSLMax="+SLMax)
}

// ================================================================================

function TabBarWidget_getItemXPos(index)
// Retrieve the x coordinates of a tab
// index	[int]	The tab index
// Returns	[int]	the x coordinates of a the tab
{
	var o=this
	var x=0
	for (var i=0;i<index;i++)
		x+=parseInt(o.items[i].getWidth())

	return x
}

// ================================================================================

function TabBarWidget_setIconState()
// Enable or disable the navigation icons first, previous, next, last
{
	var o=this

	if (o.tabsLayer==null)
		return
			
	var tabsl=o.tabsLayer
	var tabsSL=tabsl.scrollLeft,tabsOW=tabsl.offsetWidth,tabsSW=tabsl.scrollWidth,SLMax=tabsSW-tabsOW

	// Enable or disable the navigation icons if no scroll is possible on the
	// right
	if (tabsSL==SLMax)
	{
		o.nextIcn.setDisabled(true)
		o.lastIcn.setDisabled(true)
	}
	else
	{
		o.nextIcn.setDisabled(false)
		o.lastIcn.setDisabled(false)
	}

	// Enable or disable the navigation icons if no scroll is possible on the
	// left
	if (tabsSL == 0)
	{
		o.firstIcn.setDisabled(true)
		o.previousIcn.setDisabled(true)
	}
	else
	{
		o.firstIcn.setDisabled(false)
		o.previousIcn.setDisabled(false)
	}

}

// ================================================================================

function TabBarWidget_firstCB()
// Callback function called when click on the "first" icon
{	
	var p=this.par
	p.scroll('first')
}

// ================================================================================

function TabBarWidget_prevCB()
// Callback function called when click on the "previous" icon
{
	var p=this.par
	p.scroll('previous')
}

// ================================================================================

function TabBarWidget_nextCB()
// Callback function called when click on the "next" icon
{
	var p=this.par
	p.scroll('next')	
}

// ================================================================================

function TabBarWidget_lastCB()
// Callback function called when click on the "last" icon
{			
	var p=this.par
	p.scroll('last')
}

// ================================================================================
// ================================================================================
//
// OBJECT newTabbedZone (Constructor)
//
// Display a tabs bar. and a framed zone that display one content by tab
// image
//
// ================================================================================
// ================================================================================

function newTabbedZone(id,cb,w,h)
// id [String]   the tab id for DHTML processing
// cb [Function - optional] callback pointer, called when clicking on a tab
// w  [int] width
// h  [int] height
// Return   : The new object
{
	var o=newFrameZoneWidget(id,w,h)
	o.w=w
	o.h=h
	o.cb=cb
	
	o.zoneLayers=new Array
	o.oldIndex=-1
	o.tzOldInit=o.init
	o.add=TabbedZoneWidget_add
	o.select=TabbedZoneWidget_select
	o.getTabCSS=TabbedZoneWidget_getTabCSS

	o.init=TabbedZoneWidget_init
	o.beginHTML=TabbedZoneWidget_beginHTML
	
	o.oldFrameZoneEndHTML=o.endHTML
	o.endHTML=TabbedZoneWidget_endHTML
	o.tabs=newTabBarWidget("tzone_tabs_"+id,true,TabbedZone_itemClick)
	o.tabs.parentTabbedZone=o
	
	o.beginTabHTML=TabbedZoneWidget_beginTabHTML
	o.endTabHTML=TabbedZoneWidget_endTabHTML
	o.beginTab=TabbedZoneWidget_beginTab
	o.endTab=TabbedZoneWidget_endTab
	
	o.showTab=TabbedZoneWidget_showTab
    
    o.tzOldResize=o.resize
    o.resize=TabbedZoneWidget_resize

	return o
}

// ================================================================================

function TabbedZone_itemClick()
// Internal callback when an item is selected
// Return void
{
	var o=this.parentTabbedZone,i=this.getSelection().index
	o.select(i)
	if (o.cb)
		o.cb(i)
}

// ================================================================================

function TabbedZoneWidget_add(name, value, icon, iconW,iconH,iconOffX,iconOffY)
// Add an element in the tabbed zone
// name     : [String]   tab label
// value    : [String - optional] a value that is used to find it again
// icon     : [String - optional] an image URL
// iconW    : [int - optional] displayed image width
// iconH    : [int - optional] displayed image height
// iconOffX : [int - optional] x offset in the icon (for combined images)
// iconOffY : [int - optional] y offset in the icon (for combined images)
// return [TabWidget] : the new TabWidget object
{
	var o=this
	o.tabs.add(name, value, -1, icon, iconW,iconH,iconOffX,iconOffY)
	o.zoneLayers[o.zoneLayers.length]=null
}


// ================================================================================

function TabbedZoneWidget_init()
// init the widget
// return void
{
	var o=this
	o.tzOldInit()
	o.tabs.init()
	o.select(0)
}

// ================================================================================

function TabbedZoneWidget_getTabCSS(index)
// get the tab style
// return [DOM style]
{
	var o=this,ls=o.zoneLayers,l=ls[index]
	if (l==null)
		l=ls[index]=getLayer('tzone_tab_'+index+'_'+o.id)
	return l?l.style:null
}

// ================================================================================

function TabbedZoneWidget_showTab(index,show)
// Show/hide a tab
// index [int] the tab index
// show boolean : show/hide
// return void
{
	var tab=this.tabs.items[index]
	if (tab)
		tab.setDisplay(show)
}

// ================================================================================

function TabbedZoneWidget_select(index)
// selects a tab
// index [int] the tab index
// return void
{
	var o=this,tabs=o.tabs,sel=tabs.getSelection(),oldIndex=o.oldIndex,c
	o.tabs.select(index)
	if (oldIndex!=-1)
	{
		c=o.getTabCSS(oldIndex)
		if (c) c.display="none"
	}
	else
	{
		var len=o.zoneLayers.length
		for (var i=0;i<len;i++)
		{
			c=o.getTabCSS(i)
			if (c) c.display="none"
		}
	}
	
    o.oldIndex=index
	
    c=o.getTabCSS(index)
	if (c)
	{	
		c.display=""
		o.resize(o.w, o.h);
	}
}


// ================================================================================

function TabbedZoneWidget_beginHTML()
// Write the beginng of the widget HTML
// return [String] the HTML
{
	var o=this
	return '<table id="'+this.id+'" cellspacing="0" cellpadding="0" border="0"><tbody><tr valign="bottom" height="28">'+
	'<td>'+imgOffset(_skin+'dialogframe.gif',5,5,0,0)+'</td>'+
	'<td valign="top" align="left" style="'+backImgOffset(_skin+"tabs.gif",0,288)+'">'+o.tabs.getHTML()+'</td>'+
	'<td>'+imgOffset(_skin+'dialogframe.gif',5,5,5,0)+'</td></tr>'+
	'<tr><td style="'+backImgOffset(_skin+"dialogframeleftright.gif",0,0)+'"></td><td class="dialogzone"><div id="'+o.id+'_container'+'" style="'+sty("width",o.w)+sty("height",o.h)+'">'
}

function TabbedZoneWidget_endHTML()
{
	return '</div>'+this.oldFrameZoneEndHTML()
}

// ================================================================================

function TabbedZoneWidget_beginTabHTML(index)
// get the beginning of a tab zone
// index [int] the tab index
// return [String] the HTML
{
	var o=this
	return '<div id="tzone_tab_'+index+'_'+o.id+'" style="display:none;'+sty("width",o.w)+sty("height",o.h)+'">'
}

// ================================================================================

function TabbedZoneWidget_endTabHTML()
// get the end of a tab zone
// return [String] the HTML
{
	return '</div>'
}

// ================================================================================

function TabbedZoneWidget_beginTab(index)
// write in the document the beginning of a tab zone
// return void
{
	_curDoc.write(this.beginTabHTML(index))
}

// ================================================================================

function TabbedZoneWidget_endTab()
// write in the document the end of a tab zone
// return void
{
	_curDoc.write(this.endTabHTML())
}

// ================================================================================

function TabbedZoneWidget_resize(w, h)
// Resize the tab zone
// w [Int - optional] width
// h [Int - optional] height
// return void
{
    var o = this; 
    
    if (w != null) 
    {
        o.w = w;    
        w = w + 10;
    }
    if (h != null)
    {
        o.h = h;
        h = h + 33;
    }
    
    o.tzOldResize(w, h);
    
    var container = getLayer(o.id+'_container');
    if (container)
    {
        container.style.width = o.w + 'px';
        container.style.height = o.h + 'px';
    }
    
    if (o.oldIndex != null)
    {
        var tab = getLayer('tzone_tab_'+o.oldIndex+'_'+o.id);
        if (tab)
        {
            tab.style.width = o.w + 'px';
            tab.style.height = o.h + 'px';
        }
    }
}
