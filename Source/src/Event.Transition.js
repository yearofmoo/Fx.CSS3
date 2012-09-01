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
