function isMobile () {
  return window.navigator.userAgent.match(/Mobile/);
}

function isIE() { 
  return window.navigator.userAgent.match(/MSIE/);
}

var Features = {
  isMobile: isMobile,
  isIE: isIE
};

module.exports = Features;
