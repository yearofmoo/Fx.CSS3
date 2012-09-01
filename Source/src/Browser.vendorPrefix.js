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
