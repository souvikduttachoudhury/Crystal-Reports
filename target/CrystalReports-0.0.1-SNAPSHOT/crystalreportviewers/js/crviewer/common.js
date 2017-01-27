/* Copyright (c) Business Objects 2006. All rights reserved. */

if (typeof bobj == 'undefined') {
    bobj = {};    
}

if (typeof bobj.constants == 'undefined') {
    bobj.constants = {
        modalLayerIndex:1000
    };    
}

/**
 * @return [String] Returns a different id each time it's called
 */
bobj.uniqueId = function() {
    return 'bobjid_' + (++bobj.uniqueId._count);
};

if (typeof bobj.uniqueId._count == 'undefined') {
    bobj.uniqueId._count = new Date().getTime();
}

/**
 * Like MochiKit.Base.update except that it checks each item in obj against
 * a test function before adding it to self.
 * 
 * @param test [Function]    function that returns a boolean when passed (self, obj, key)
 * @param self [Object|null] object to be updated
 * @param obj  [Object]      object to copy properties from
 */
bobj.updateIf = function (test, self, obj/*, ... */) {
    if (self === null) {
        self = {};
    }
    for (var i = 1, len = arguments.length; i < len; i++) {
        var o = arguments[i];
        if (typeof(o) != 'undefined' && o !== null) {
            for (var k in o) {
                if (test(self, obj, k)) {
                    self[k] = o[k];
                }
            }
        }
    }
    return self;
};

/**
 * Copy properties from obj to self if the properties are undefined in self
 */
bobj.fillIn = MochiKit.Base.partial(bobj.updateIf, function(self, obj, k) {
    return (typeof(self[k]) == 'undefined');
});

bobj.isObject = function(obj) {
    return (obj && typeof obj == 'object');
};

bobj.isArray = function(obj) {
    return (bobj.isObject(obj) && obj.constructor == Array);
};

bobj.isString = function(obj) {
    return (typeof(obj) == 'string');    
};

bobj.isNumber = function(obj) {
    return typeof(obj) == 'number' && isFinite(obj);
};

bobj.isBoolean = function(obj) {
    return typeof obj == 'boolean';
};

bobj.isFunction = function(obj) {
    return typeof(obj) == 'function';
};

/**
 * Checks for the border box model, where css width includes padding and borders.
 * IE uses this box model when a strict dtd is not specified.
 *
 * @return [boolean]  Returns true if the border box model is being used 
 */
bobj.isBorderBoxModel = function() {
    if (typeof bobj.isBorderBoxModel._cachedValue == 'undefined') {
    	/*
    	 * TODO: It is unnecessary to create DIV to check border box model. All we need to do is check _ie && quirksMode
    	 * I didn't remove it for sake of not breaking different scenarios (requires alot of testing)
    	 */
        if(document.body) {
            var box = document.createElement('div');
            box.style.width = '10px';
            box.style.padding = '1px';
            box.style.position = 'absolute'; 
            box.style.visibility = 'hidden'; 
        
            document.body.appendChild(box);
            bobj.isBorderBoxModel._cachedValue = (box.offsetWidth == 10);
            document.body.removeChild(box);
        }
        else {
            return _ie && bobj.isQuirksMode();
        }
    }
    return bobj.isBorderBoxModel._cachedValue;
};

/**
 * @return [boolean] True if the document is rendering in quirks mode
 */
bobj.isQuirksMode = function() {
    return (document.compatMode != 'CSS1Compat');
};

/* Sets the visual style of the specified element
 *
 * @param element [DOM node]
 * @param visualStyle {} object containing visual styles
 */
bobj.setVisualStyle =function(element,visualStyle) {
   
   if(element === null || visualStyle === null) {
        return;
   }
   
   var elemStyle = element.style;
   
   if(visualStyle.className) {
        element.className = visualStyle.className;
   }
   if(visualStyle.backgroundColor){
        elemStyle.backgroundColor = visualStyle.backgroundColor;
   }
      
   if(visualStyle.borderWidth){
        elemStyle.borderWidth = visualStyle.borderWidth;
   }
   
   if(visualStyle.borderStyle){
        elemStyle.borderStyle = visualStyle.borderStyle;
   }
   
   if(visualStyle.borderColor){
        elemStyle.borderColor = visualStyle.borderColor;
   }
   
   if(visualStyle.fontFamily) {
       elemStyle.fontFamily = visualStyle.fontFamily;
   }
   
   if(visualStyle.fontWeight) {
       elemStyle.fontWeight = visualStyle.fontWeight;
   }
   
   if(visualStyle.textDecoration) {
       elemStyle.textDecoration = visualStyle.textDecoration;
   }
   
   if(visualStyle.color) {
        elemStyle.color = visualStyle.color;
   }
   
   if(visualStyle.width) {
        elemStyle.width = visualStyle.width;
   }
   
   if(visualStyle.height) {
       elemStyle.height = visualStyle.height;
   }
   
   if(visualStyle.fontStyle) {
        elemStyle.fontStyle = visualStyle.fontStyle;
   }
   
   if(visualStyle.fontSize) {
        elemStyle.fontSize = visualStyle.fontSize;
   }
   
   if(visualStyle.left) {
        elemStyle.left = visualStyle.left;
   }

   if(visualStyle.top) {
        elemStyle.top = visualStyle.top;
   }      
};

/**
 * Sets the outer size of an element, including padding, borders and margins.
 *
 * Note: Non-pixel units are ignored 
 *
 * @param node [DOM node]
 * @param w    [Int - optional]  Width in pixels
 * @param h    [Int - optional]  Height in pixels
 * @param excludeMargins [bool - optional] When true, margins are not included 
 *                                         in the box size.
 */
bobj.setOuterSize = function(node, w, h, excludeMargins) {
    var origStyle = null;
    var nodeStyle = node.style;
    if (nodeStyle.display == 'none') {
        // Nodes have to be displayed to get their calculated styles.
        // We display them but make them invisible and absolutely positioned
        // so they don't affect the layout.
        origStyle = {
            visibility: nodeStyle.visibility,
            position: nodeStyle.position,
            display: 'none'
        };
        
        nodeStyle.visibility = 'hidden';
        nodeStyle.position = 'absolute';
        nodeStyle.display = '';
    }
    
    function pixels (selector) {
        var value = MochiKit.DOM.getStyle(node, selector);
        if (bobj.isString(value) && value.substring(value.length - 2 == 'px')) {
            return (parseInt(value, 10) || 0);
        }
        return 0;
    }
    
    if (bobj.isNumber(w)) {
        if (!bobj.isBorderBoxModel()) {
            w -= pixels('border-left-width');
            w -= pixels('border-right-width');
            w -= pixels('padding-left');
            w -= pixels('padding-right');
            
            if(excludeMargins) {
                w -= pixels('margin-left');
                w -= pixels('margin-right');
            }
        }
       nodeStyle.width = Math.max(0, w) + 'px';
    }
    
    if (bobj.isNumber(h)) {    
        if (!bobj.isBorderBoxModel()) {
            if(excludeMargins) {
                    h -= pixels('margin-top');
                    h -= pixels('margin-bottom');
        	}
            h -= pixels('border-top-width');
            h -= pixels('border-bottom-width');
            h -= pixels('padding-top');
            h -= pixels('padding-bottom');
        }
        nodeStyle.height = Math.max(0, h) + 'px';
    }
    
    if (origStyle) {
        nodeStyle.display = origStyle.display;
        nodeStyle.position = origStyle.position;
        nodeStyle.visibility = origStyle.visibility;
    }
};

/** 
 * Place an element with one of it's corners as near (x,y) as possible such that
 * the element is within the viewport
 *
 * @param elt [DOM Node] Element to place
 * @param x [int] Absolute horizontal position
 * @param y [int] Absolute vertical position
 * @param preferLeft [bool] Place left of x if there's enough space
 * @param preferTop [bool] Place above y if there's enough space
 */
bobj.placeElement = function (elt, x, y, preferLeft, preferTop) {
    var eltStyle = elt.style;
    var oldVis = eltStyle.visibility || "visible"; 
    eltStyle.visibility = "hidden";
    eltStyle.position = "absolute";
    var oldDis = eltStyle.display;
    eltStyle.display = '';
    
    var eltX = x;
    var eltY = y;
    var eltW = elt.offsetWidth;
    var eltH = elt.offsetHeight;
    
    var wx1 = getScrollX();
    var wx2 = getScrollX() + winWidth();
    var wy1 = getScrollY();
    var wy2 = getScrollY() + winHeight();
    
    var isRightQ;
    if (preferLeft && ((x - wx1) > eltW)) { // place left
        isRightQ = false;
    }
    else if ((wx2 - x) > eltW) { // place right
        isRightQ = true;
    }
    else { // place wherever there's more space
        isRightQ = (wx2 - x) > (x - wx1);
    }
    
    var isBottomQ;
    if (preferTop && ((y - wy1) > eltH)) { // place top
        isBottomQ = false;    
    }
    else if ((wy2 - y) > eltH) { // place bottom
        isBottomQ = true;
    }
    else { // place wherever there's more space
        isBottomQ = (wy2 - y) > (y - wy1);
    }
    
    if (!isRightQ) { eltX -= eltW; }
    if (!isBottomQ) { eltY -= eltH; }
    
    if ((eltX + eltW) > wx2) {
        eltX = wx2 - eltW;    
    }

    if ((eltY + eltH) > wy2) {
        eltY = wy2 - eltH;    
    }
    
    eltX = Math.max(wx1, eltX);
    eltY = Math.max(wy1, eltY);
    
    eltStyle.left = eltX + 'px';
    eltStyle.top = eltY + 'px';    
    eltStyle.visibility = oldVis; 
    eltStyle.display = oldDis;
};

/**
 * Get the node that contains a child widget.
 *
 * @param child [object]    the widget whose parent node to be looked for
 */
bobj.getContainer = function(child) {
    if (child && child.layer) {
        return child.layer.parentNode;
    }
    return null;
};

/**
 * Checks whether elem has a parent with the tag name equivalent to parentTagName
 *
 * @param elem          [HTML node] the element whose parent is checked against parentTagName
 * @param parentTagName [String] Parent's tagName ie) TABLE
 *
 *
 * @return [boolean] True if elem has a parent with tagName equivalent to parentTagName
 */
bobj.checkParent = function(elem,parentTagName) {
    var foundParent = false;
    if(elem && parentTagName) {
        parentTagName = parentTagName.toUpperCase();
        var parent = elem.parentNode;
        
        while(parent) {
            if(parent.tagName == parentTagName) {
                foundParent = true;
                break;
            }
            parent = parent.parentNode;    
        }
    }
    
    return foundParent;
};

/**
 * Implements Array.slice for array-like objects. For example, the special 
 * "arguments" variable within function calls is array-like but doesn't have
 * a slice method.
 *
 * @param arrayLike [Object]  An array-like object as defined by MochiKit.Base.isArrayLike.
 * @param begin     [Number]  Zero-based index at which to begin extraction.
 * @param end       [Number]  Zero-based index at which to end extraction. 
 *                            Extracts up to but not including end.
 *
 * @return [Array] A shallow copy of the portion of the array specified or null if invalid argument. 
 */ 
bobj.slice = function(arrayLike, begin, end) {
    if (bobj.isArray(arrayLike)) {
        return arrayLike.slice(begin, end);    
    }
    else if (MochiKit.Base.isArrayLike(arrayLike)) {
        var retArray = [];
        
        var endIdx = arrayLike.length;
        if (bobj.isNumber(end) && end < endIdx) {
            endIdx = end;    
        }
        
        begin = Math.max(begin, 0);
        
        for (var i = begin; i < endIdx; ++i) {
            retArray.push(arrayLike[i]);    
        }
        
        return retArray;
    }
    return null;
};

/**
 * Extract a range of elements from a string or array-like list (non-destructive)
 *
 * @param list  [String | Array-Like] 
 * @param start [Int] Index of start, inclusive
 * @param end   [Int] Index of end, exclusive
 *
 * @return Array of extracted elements or Null
 */
bobj.extractRange = function(list, start, end) {
    if (list && bobj.isNumber(start)) {
        if (!bobj.isNumber(end) || end > list.length) {
            end = list.length;
        }
        
        start = Math.max(0, start);
        
        if (start < end) {
            var s1 = 0, e1 = start;
            var s2 = end, e2 = list.length;
            
            if (list.substring) {
                return (list.substring(s1, e1) + list.substring(s2, e2));    
            }
            else {
                return bobj.slice(list, s1, e1).concat(bobj.slice(list, s2, e2));    
            }
        }
    }
    return list;
};

/**
 * Returns a value with a unit appended
 * 
 * @param val  [int or string] 
 * @param unit [sring - optional]  Defaults to 'px'   
 *
 * @return [string] Returns val as a string with unit appended if val is a 
 * number. Returns val without modification if val is not a number.
 */
bobj.unitValue = function(val, unit) {
    if (bobj.isNumber(val)) {
        return val + (unit || 'px');    
    }
    return val;
};

/**
 * Evaluate an expression in the window (global) scope
 *
 * @param expression [String]  Expression to evaluate
 *
 * @return Returns the result of the evaluation
 */
bobj.evalInWindow = function(expression) {
    if (window.execScript) { // Internet Explorer
        return window.execScript(expression);
    }
    else {
        return MochiKit.Base.bind(eval, window, expression).call();
    }
};

/**
 * Remove whitespace from the left end of a string.
 *
 * @param str [String]
 *
 * @return [String] Returns a string with no leading whitespace 
 */
bobj.trimLeft = function(str) {
    str = str || '';
    return str.replace(/^\s+/g, '');
};

/**
 * Remove whitespace from the right end of a string.
 *
 * @param str [String]
 *
 * @return [String] Returns a string with no trailing whitespace 
 */
bobj.trimRight = function(str) {
    str = str || '';
    return str.replace(/\s+$/g, '');
};

/**
 * Remove whitespace from both ends of a string.
 *
 * @param str [String]
 *
 * @return [String] Returns a string with no leading or trailing whitespace 
 */
bobj.trim = function(str) {
  return bobj.trimLeft(bobj.trimRight(str));
};

/**
 * Check if the two inputs (and their contents) are equal.
 *
 * @param obj1 [Any]
 * @param obj2 [Any]
 *
 * @return [boolean] Returns true if the two inputs are equal.
 */
bobj.equals = function (obj1, obj2) {
    if (typeof(obj1) != typeof(obj2)) {
        return false;
    }
    
    if (bobj.isObject(obj1)) {
        var same = true;
        for (var prop in obj1) {
            same = same && bobj.equals(obj1[prop], obj2[prop]);
        }
        return same;
    }
    else {
        return obj1 == obj2;
    }
};

/**
 * Creates a stylesheet link and adds it to document body
 * @param1 href [String] location of css file
 *
 */
bobj.includeLink = function(href) {
    var head = document.getElementsByTagName("head")[0];
    var body = document.body;

        var link = document.createElement("link");
        link.setAttribute("rel","stylesheet");
        link.setAttribute("type","text/css");
        link.setAttribute("href",href);
 
        if(head) {
            head.appendChild(link);
        }        
        else if(body) {
            body.appendChild(link);
        }

};

bobj.addStyleSheet = function(stylesheet,id) {
    var style = document.createElement('style');
    style.setAttribute("type", "text/css");
    
    if(id) {
        style.setAttribute("id", id);
    }
    
    if (style.styleSheet) {
        style.styleSheet.cssText = stylesheet;
    }
    else {
       style.appendChild(document.createTextNode(stylesheet));
    }
    
    var head = document.getElementsByTagName('head');
    var body = document.getElementsByTagName('body');
    
    if(head && head[0]) {
        head[0].appendChild(style);
    }
    else if(body && body[0]) {
        body[0].appendChild(style);
    }

};

bobj.removeAllChildElements = function(elem) {
    if(elem) {
        while(elem.firstChild) {
            bobj.removeAllChildElements(elem.firstChild);
            elem.removeChild(elem.firstChild);
        }
    }
};

bobj.getValueHashCode = function(valueType, value) {
    var Types = bobj.crv.params.DataTypes;
    switch(valueType) {
        case Types.BOOLEAN :
        case Types.CURRENCY:
        case Types.NUMBER:
        case Types.STRING:
            return '' + value;
        case Types.TIME:
            return '' + value.h + ',' + value.min + ',' + value.s + ',' + value.ms;
        case Types.DATE:
            return '' + value.y  + ',' + value.m +  ',' + value.d;
        case Types.DATE_TIME:
            return '' + value.y + ',' +value.m + ',' + value.d + ',' + value.h + ',' + value.min + ',' + value.s + ',' + value.ms;
    }
};

bobj.encodeUTF8 = function(string) {
    var arr = [];
    var strLen = string.length;
    for(var i = 0; i < strLen; i++) {
        var c = string.charCodeAt(i);
        if(c < 0x80) {
            arr.push(c);
        }
        else if(c < 0x0800) {
            arr.push((c >> 6) | 0xc0);
            arr.push(c & 0x3f | 0x80);
        }
        else if(c < 0xd800 || c >= 0xe000) {
            arr.push((c >> 12) | 0xe0);
            arr.push((c >> 6) & 0x3f | 0x80);
            arr.push(c & 0x3f | 0x80);
        }
        else if(c < 0xdc00) {
            var c2 = string.charCodeAt(i + 1);
            if(isNaN(c2) || c2 < 0xdc00 || c2 >= 0xe000) {
                arr.push(0xef, 0xbf, 0xbd);
                continue;
            }
            i++;
            val = ((c & 0x3ff) << 10) | (c2 & 0x3ff);
            val += 0x10000;
            arr.push((val >> 18) | 0xf0);
            arr.push((val >> 12) & 0x3f | 0x80);
            arr.push((val >> 6) & 0x3f | 0x80);
            arr.push(val & 0x3f | 0x80);
        }
        else {
            arr.push(0xef, 0xbf, 0xbd);
        }
    }
    return arr;
};

bobj.encodeBASE64 = function(byteArray) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var arr = [];
    var c1, c2, c3, e1, e2, e3, e4;
    var i = 0, arrLen = byteArray.length;
    
    while(i < arrLen) {
        c1 = byteArray[i++];
        c2 = byteArray[i++];
        c3 = byteArray[i++];
        
        e1 = c1 >> 2;
        e2 = ((c1 & 3) << 4) | (c2 >> 4);
        e3 = ((c2 & 15) << 2) | (c3 >> 6);
        e4 = c3 & 63;
        
        if (isNaN(c2)) {
            e3 = e4 = 64;
        } else if(isNaN(c3)) {
            e4 = 64;
        }
        arr.push(keyStr.charAt(e1));
        arr.push(keyStr.charAt(e2));
        arr.push(keyStr.charAt(e3));
        arr.push(keyStr.charAt(e4));
    }
    return arr.join('');
};

/**
 * Checks if there's a DOM element whose ID attribute matches the given string. If not, continue to search for a DOM element
 * whose Name attribute matches the given string.
 *
 * @param idOrName [string] The ID or Name of the element to search for.
 * @return [DOM element]  Returns a DOM element, or null.
 */
bobj.getElementByIdOrName = function (idOrName) {
    if (!idOrName) {
        return null;
    }
    
    var elem = document.getElementById(idOrName);
    if (elem) {
        return elem;
    }
    
    var elems = document.getElementsByName(idOrName);
    if (elems && elems.length > 0) {
        return elems[0];
    }
    
    return null;
};

/*
 * Returns a rectangle that can be used for css clip property
 * @param top, right, bottom, left [Int]
 * @return [String] returns rect(top,right,bottom,left) in pixel unit 
 */
bobj.getRect = function(top, right, bottom, left) {
	return "rect(" + top + "px, "+ right + "px," + bottom + "px," + left + "px)";
}

bobj.getBodyScrollDimension = function() {
    var w = 0;
    var h = 0;
    var bodyTags = document.getElementsByTagName("Body");
    if(bodyTags && bodyTags[0]) {
        w = bodyTags[0].scrollWidth;
        h = bodyTags[0].scrollHeight;
    }
    
    return {w : w, h : h};
}
