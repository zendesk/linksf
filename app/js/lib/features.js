function isMobile () {
  return window.navigator.userAgent.match(/Mobile/);
}

var Features = {
  isMobile: isMobile
};

module.exports = Features;
