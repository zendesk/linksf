/* globals document,window */
var $ = require('jquery');

var InfiniteScrollControl = function(onLoadFunc) {
  this.onLoadMoreFunc = onLoadFunc;
};

$.extend(InfiniteScrollControl.prototype, {
  isLoading: false,
  isDisabled: false,
   
  _getDocumentHeight: function() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
  },

  triggerScroll: function() { 
    if ( this.isLoading || this.isDisabled) {
      return;
    }

    this.isLoading = true;
   
    if ( $(window).scrollTop() + $(window).height() >= this._getDocumentHeight() - 200 ) {
      this.onLoadMoreFunc(this.onLoadMoreComplete.bind(this));
    } else {
      this.isLoading = false;
      return;
    }
  },

  onLoadMoreComplete: function(scrollAgain) { 
    this.isLoading = false;
    if ( !scrollAgain ) {
      this.isDisabled = true;
    }
  }
}); 

module.exports = InfiniteScrollControl;
