function isMobile () {
  return /Mobile/.test(window.navigator.userAgent);
}

function isIOS() {
  return /(iPad|iPhone|iPod)/g.test(window.navigator.userAgent);
}

function isIE() {
  return /MSIE/.test(window.navigator.userAgent);
}

function isAndroid22() {
  return /Android 2\.2/.test(window.navigator.userAgent);
}

var Features = {
  isAndroid22: isAndroid22,
  isMobile: isMobile,
  isIOS: isIOS,
  isIE: isIE
};

module.exports = Features;
