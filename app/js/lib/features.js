function isMobile () {
  return window.navigator.userAgent.match(/Mobile/);
}

function isIE() {
  return window.navigator.userAgent.match(/MSIE/);
}

function isAndroid22() {
  return window.navigator.userAgent.match(/Android 2\.2/);
}

var Features = {
  isAndroid22: isAndroid22,
  isMobile: isMobile,
  isIE: isIE
};

module.exports = Features;
