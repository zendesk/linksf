/*globals window */

function isMobile () {
  return window.navigator.userAgent.match(/Mobile/);
}

function isDesktop () {
  return !isMobile ();
}

var Features = {
  isDesktop: isDesktop,
  isMobile: isMobile
};

module.exports = Features;
