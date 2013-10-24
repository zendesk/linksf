var BaseController = function (options) {
  options = options || {};
  var currentView,
      el = options.el || 'body';

  function removeView (view) {
    view.remove();
  }

  function render (view) {
    if (currentView && !currentView.options.isSingleton) {
      currentView.remove();
    }

    currentView = view;
    view.delegateEvents(view.events);
    return $(el).html(view.render().el);
  }

  this.render = render;
};

module.exports = BaseController;
