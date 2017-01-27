/* Copyright (c) Business Objects 2006. All rights reserved. */


bobj.crv.Tooltip = {
    show: function(tipHtml, x, y, options) { 
        options = MochiKit.Base.update({
            delay: 0.5,          // delay before starting to show the tooltip
            duration: 0.5,       // duration of fade in/out effect in seconds
            aspect: 2.0,         // Ratio of width to height
            wrapThreshold: 200   // Min width in px before growing vertically
        }, options);
        
        this._options = options;
        this._tipHtml = tipHtml;
        this._x = x;
        this._y = y;
        
        if (!this._layer) {
            this._createLayer();
            this._delayedShow = MochiKit.Base.bind(this._delayedShow, this);
            this._delayedHide = MochiKit.Base.bind(this._delayedHide, this);
        }
        
        clearTimeout(this._timeoutId);
        this._timeoutId = setTimeout(this._delayedShow, options.delay * 1000);
    },  
    
    _delayedShow: function() {
        if (this._effect) {
            this._effect.cancel();
        }
        
        var style = this._layer.style;
            
        if (!this._options._fastShow) {
            if (bobj.isString(this._tipHtml)) {
                this._layer.firstChild.innerHTML = this._tipHtml;
            }
            
            this._resize();
            bobj.placeElement(this._layer, this._x, this._y, false, false);
        }
        style.visibility = 'visible';
        this._effect = MochiKit.Visual.appear(this._layer, {duration: this._options.duration});
    },
    
    hide: function(options) {
        if (this._layer) {
            this._options = MochiKit.Base.update(this._options, options); 
            clearTimeout(this._timeoutId);
            this._timeoutId = setTimeout(this._delayedHide, this._options.delay * 1000);
        }
    },
    
    _delayedHide: function() {
        if (this._effect) {
            this._effect.cancel();
        }
              
        var layer = this._layer;
        this._effect = MochiKit.Visual.fade(layer, {
            duration: this._options.duration,
            afterFinish: function(){layer.style.visibility = 'hidden';},
            afterFinishInternal: null //don't set display:none
        });
    },
    
    _elementConnections: {},
    
    setElementTooltip: function(elt, tipHtml, options) { 
        var CONNECT = MochiKit.Signal.connect;
        if (elt) {
            if (elt.bobj_crv_tooltip_id) {
                this.removeElementTooltip(elt);
            }
            else {
                elt.bobj_crv_tooltip_id = bobj.uniqueId();    
            }
            
            var idents = [];
            this._elementConnections[elt.bobj_crv_tooltip_id] = idents;
            
            var over = function(e) { 
                var p = e.mouse().page;
                bobj.crv.Tooltip.show(tipHtml, p.x, p.y, options);
            };
            var out = function(e) {
                bobj.crv.Tooltip.hide(options);    
            };
            idents.push(CONNECT(elt, 'onmouseover', over));
            idents.push(CONNECT(elt, 'onmouseout', out));
        }
    },

    removeElementTooltip: function(elt) {
        if (elt && elt.bobj_crv_tooltip_id) {
            var idents = this._elementConnections[elt.bobj_crv_tooltip_id];
            if (idents) {
                for (var i = 0, len = idents.length; i < len; ++i) {
                    MochiKit.Signal.disconnect(idents[i]);    
                }
                delete this._elementConnections[elt.bobj_crv_tooltip_id];
            }
        }
    },
    
    _createLayer: function() {
        var CONNECT = MochiKit.Signal.connect;
        var DIV = MochiKit.DOM.DIV;
        this._layer = DIV({'class': "crvTooltip", 
            style:"visibility:hidden, position:absolute; display:block; top:0px; left:0px"}, 
            DIV(null, '&nbsp;'));
        
        MochiKit.DOM.setOpacity(this._layer, 0); 
        document.body.appendChild(this._layer);
        
        var over = function(e) { 
            if (bobj.crv.Tooltip._effect) {
                bobj.crv.Tooltip.show(null, null, null, 
                    MochiKit.Base.update({_fastShow: true}, bobj.crv.Tooltip._options)); 
            }
        };
        var out = function(e) {
            bobj.crv.Tooltip.hide(bobj.crv.Tooltip._options);   
        };
        CONNECT(this._layer, 'onmouseover', over);
        CONNECT(this._layer, 'onmouseout', out);
    },
    
    _resize: function() { 
        var layer = this._layer;
        var layerStyle = layer.style;
        var content = layer.firstChild;
        
        var aspect = this._options.aspect;
        var wrapThreshold = this._options.wrapThreshold; 
        
        var oldLeft = layerStyle.left;

        layerStyle.visibility = "hidden";
        layerStyle.left = '-' + wrapThreshold + 'px';
        layerStyle.width = null;
        layerStyle.height = null;
        
        if (content.offsetWidth > wrapThreshold) { 
            var paddingY = parseInt(MochiKit.Style.computedStyle(layer, 'padding-top'), 10) || 0; 
            paddingY += parseInt(MochiKit.Style.computedStyle(layer, 'padding-bottom'), 10) || 0;
            
            var paddingX = parseInt(MochiKit.Style.computedStyle(layer, 'padding-left'), 10) || 0; 
            paddingX += parseInt(MochiKit.Style.computedStyle(layer, 'padding-right'), 10) || 0;
            
            //force overflow to get the smallest possible content width
            layerStyle.width = '1px'; 
            //now force reflow because some browsers will not fill the available
            //width otherwise (IE7)
            layerStyle.width = (content.offsetWidth + paddingX) +'px';
            content.innerHTML += '';
            
            var contentArea = content.offsetWidth * content.offsetHeight; 
            var height = Math.ceil(Math.sqrt(contentArea / aspect)); 
            var width = height * aspect;
            
            layerStyle.height = height + paddingY + 'px';
            layerStyle.width = width + 'px';
            
            while(content.offsetWidth > layer.clientWidth ||
                content.offsetHeight > layer.clientHeight) { 
                height += 5;
                width = height * aspect;
                layerStyle.height = height + 'px';
                layerStyle.width = width + 'px';
            }
        }
        
        layerStyle.left = oldLeft || null; //setting "" doesn't always work
    }
};
