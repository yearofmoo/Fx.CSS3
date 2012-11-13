['ie','chrome','safari','opera'].each(function(name) {
  if(Browser[name]) {
    Browser.name = name;
  }
});

if(Browser.firefox || Browser.moz || Browser.gecko) {
  Browser.name = 'moz';
}
//IE 10 detection
Browser.ie10 = Browser.ie && !Browser.ie9 && navigator.userAgent.test(/Trident\/6\.0/);

//each browser has it own vendor prefix
if(Browser.chrome || Browser.safari) {
  Browser.vendorPrefix = '-webkit-';
}
else if(Browser.firefox) {
  Browser.vendorPrefix = '-moz-';
}
else if(Browser.opera) {
  Browser.vendorPrefix = '-o-';
}
else if(Browser.ie10 || Browser.ie9 || Browser.ie8) {
  Browser.vendorPrefix = '-ms-';
}
else {
  Browser.vendorPrefix = '';
}
(function() { 

  Browser.getVendorStyle = function(property) {
    var applyPrefix = false;
    switch(property) {
      case 'box-shadow':
      case 'border-radius':
        applyPrefix = !Browser.opera && !Browser.ie;
      break;
      case 'text-shadow':
        if(Browser.ie && Browser.version < 10) return false;
      break;

      case 'border-image':
        if(Browser.ie) return false;
        applyPrefix = !Browser.opera;
      break;

      case 'transform':
        applyPrefix = true;
      break;
    }
    if(applyPrefix) {
      property = Browser.vendorPrefix + property;
    }
    return property;
  };

  var allowCSS3Prefix = 'allowCSS3';

  ['webkitBorderRadius','mozBorderRadius','borderRadius'].each(function(key) {
    Element.Styles[allowCSS3Prefix + key] = Element.Styles[key] = '@px';
  });

  ['wekitBoxShadow','mozBoxShadow','boxShadow'].each(function(key) {
    Element.Styles[allowCSS3Prefix + key] = Element.Styles[key] = 'rgb(@, @, @) @px @px @px @px';
  });

  var key = 'textShadow';
  Element.Styles[allowCSS3Prefix + key] = Element.Styles[key] = 'rgb(@, @, @) @px @px @px';

})();
Element.Events.transition = {
  events : {
    chrome : 'webkitTransitionEnd',
    safari : 'webkitTransitionEnd',
    moz : 'transitionend',
    opera : 'oTransitionEnd',
    ie : 'MSTransitionEnd'
  },
  onAdd: function(fn) {
    var key = Browser.name;
    var event = Element.Events.transition.events[key];
    $(this).addEventListener(event,fn);
  },
  onRemove : function(fn) {
    var key = Browser.name;
    var event = Element.Events.transition.events[key];
    $(this).removeEventListener(event,fn);
  }
}
Fx.CSS3 = new Class({

  Implements : [Events, Options, Chain],

  options : {
    useSpecificStyling : false,
    transition : 'elastic',
    duration : '0.5s',
    link : 'cancel'
  },

  initialize : function(element, options) {
    this.element = document.id(element);
    this.setOptions(options);
    this.setupEvents();
  },

  setupEvents : function() {
    this.getElement().addEvent('transition',this.onAnimationComplete.bind(this));
  },

  getElement : function(element) {
    return this.element;
  },

  queueStart : function(args) {
    this.getQueue().push(args);
  },

  getQueue : function() {
    if(!this.queue) {
      this.queue = [];
    }
    return this.queue;
  },

  popQueue : function() {
    var queue = this.getQueue();
    if(queue.length > 0) {
      var next = queue.shift();
      if(next) {
        this.start(next);
      }
    }
  },

  start : function(styles) {
    var link = this.options.link;
    if(link == 'wait') {
      this.queueStart(styles);
      return this;
    }
    else if(link == 'cancel') {
      this.cancel();
    }
    else if(this.isRunning() && link == 'ignore') {
      return;
    }

    this.stopped = false;
    this.running = true;
    this.removeCSSTransitionStyle();
    if(typeOf(styles) == 'string' && styles.charAt(0) == '.' && styles.length > 1) {
      this.applyCSSTransitionStyle();
      var className = styles.substr(1);
      this.getElement().addClass(className);
      this.onStart();
    }
    else {
      this.prependStyles(this.getElement(),styles);
      (function() {
        this.applyCSSTransitionStyle();
        this.applyStyles(styles);
        this.onStart();
      }).delay(50, this);
    }
    return this;
  },

  complete : function() {
    this.running = false;
    this.popQueue();
    this.onComplete();
  },

  prependStyles : function(element, hash) {
    var styles = {}, missingStyles = [];
    Object.each(hash, function(v, key) {
      var value, isArray = typeOf(v) == 'array' && v.length > 1;
      if(isArray) {
        value = v[0];
      }
      if(value == null || !isArray) {
        missingStyles.push(key);
        value = 0;
      }
      styles[key] = value;
    });
    if(missingStyles.length > 0) {
      missingStyles = element.getStyles(missingStyles);
      for(var i in missingStyles) {
        styles[i] = missingStyles[i];
      }
    }
    alert(JSON.encode(styles));
    styles = this.prepareStyles(styles);
    this.getElement().setStyles(styles);
  },

  applyStyles : function(hash) {
    var styles = {};
    Object.each(hash, function(value, key) {
      if(typeOf(value) == 'array') {
        value = value[value.length-1];
      }
      styles[key] = value;
    });
    styles = this.prepareStyles(styles);
    this.getElement().setStyles(styles);
  },

  prepareStyles : function(styles) {
    var values = {};
    for(var i in styles) {
      var key = this.convertCSSKey(i);
      if(key == false) continue;
      var value = this.convertCSSValue(i, styles[i]);
      values[key] = value;
    }
    return values;
  },

  removeCSSTransitionStyle : function() {
    this.setCSSTransitionValue('none');
  },

  applyCSSTransitionStyle : function() {
    this.setCSSTransitionValue('all ' + this.getDuration() + ' ' + this.getTransition());
  },

  setCSSTransitionValue : function(value) {
    this.getElement().setStyle(Browser.vendorPrefix + 'transition',value);
  },

  convertCSSKey : function(key) {
    return Browser.getVendorStyle(key);
  },

  convertCSSValue : function(property, value) {
    value = value.toString();
    var k = property.camelCase();
    var replacement = Element.Styles[k];
    if(replacement && Element.Styles['allowCSS3' + k]) {
      var parsed = new Fx.CSS().parse(value);
      var combined = [];
      parsed.each(function(bit) {
        var value = bit.value;
        if(typeOf(value) == 'array') {
          combined.append(value);
        }
        else {
          combined.push(value);
        }
      });
      combined.each(function(value) {
        replacement = replacement.replace('@',value);
      });
      value = replacement;
    }
    else {
      value = value.split(' ').map(function(v) {
        if(v.test(/^\d+$/)) {
          v += 'px';
        }
        return v;
      }).join(' ');
    }
    return value;
  },

  getDuration : function() {
    var dur = this.options.duration;
    var fin = dur.toString().charAt(dur.length-1);
    if(fin != 's') {
      dur /= 1000;
      dur += 's';
    }
    return dur;
  },

  getTransition : function() {
    var transition = this.options.transition;
    if(typeOf(transition) == 'string') {
      var token = ':';
      transition = transition.toLowerCase().trim();
      if(transition.contains(token)) {
        transition = transition.split(token)[0];
      }
    }
    switch(transition) {
      case 'quad':
        return transition;
      break;
      default:
        return 'linear';
      break;
    }
  },

  onStart : function() {
    this.fireEvent('start');
  },

  onComplete : function() {
    this.fireEvent('complete');
  },

  onAnimationComplete : function() { 
    if(!this.isStopped()) {
      this.complete();
      this.callChain();
    }
  },

  isStopped : function() {
    return this.stopped;
  },

  isRunning : function() {
    return this.running;
  },

  pause : function() {
    this.running = false;
    this.removeCSSTransitionStyle();
    this.fireEvent('pause');
  },

  resume : function() {
    this.running = true;
    this.applyCSSTransitionStyle();
  },

  stop : function() {
    this.removeCSSTransitionStyle();
    this.stopped = true;
    this.running = false;
    this.onStop();
  },

  cancel : function() {
    this.stop();
    return this;
  },

  onStop : function() {
    this.fireEvent('stop');
  }

});

Fx.CSS3.supported = (function() {
  var key = Browser.vendorPrefix + 'transition';
  var value = 'all 1s linear';
  var b = document.id(document.body);
  var result = b.setStyle(key,value).getStyle(key) == value;
  b.setStyle(key,'');
  return result;
})();

Fx.CSS3.createSupportedInstance = function(element,options) {
  return new (Fx.CSS3.supported ? Fx.CSS3 : Fx.Morph)(element,options);
};
if(Fx.CSS3.supported) {
  (function() {

    var instanceKey = 'fx:css3:instance';

    Element.Properties.tween = {
      set: function(options){
        this.get('tween').cancel().setOptions(options);
        return this;
      },

      get: function(){
        var tween = this.retrieve(instanceKey);
        if (!tween){
          tween = new Fx.CSS3(this, {link: 'cancel'});
          this.store(instanceKey, tween);
        }
        return tween;
      }
    };

    Element.Properties.morph = {
      set: function(options){
        this.get('morph').cancel().setOptions(options);
        return this;
      },

      get: function(){
        var morph = this.retrieve(instanceKey);
        if (!morph){
          morph = new Fx.CSS3(this, {link: 'cancel'});
          this.store(instanceKey, morph);
        }
        return morph;
      }
    };

    Element.implement({

      tween : function(css, value) {
        $(this).get('tween').start(css, value);
        return this;
      },

      morph : function(values) {
        $(this).get('morph').start(values);
        return this;
      }

    });

  })();
}
