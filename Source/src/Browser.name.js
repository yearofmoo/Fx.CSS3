['ie','chrome','safari','opera'].each(function(name) {
  if(Browser[name]) {
    Browser.name = name;
  }
});

if(Browser.firefox || Browser.moz || Browser.gecko) {
  Browser.name = 'moz';
}
