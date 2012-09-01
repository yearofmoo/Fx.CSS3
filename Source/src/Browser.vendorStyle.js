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
