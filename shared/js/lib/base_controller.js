var BaseController = function (options) {
  options = options || {};
  var currentView,
      el = options.el || 'body',
      navEl = options.navEl || '.nav-container';

  function removeView (view) {
    view.remove();
  }

  var _navRendered = false;

  function setupNav(buttons, view) {
    $(navEl).find('button').remove();
    buttons.forEach(function(button) {
      var el = $("<button type='button' class='unselectable'>").addClass(button.class).attr("id", button.id).html(button.text);

      if ( button.action ) {
        el.click(function(event) { return view[button.action].call(view.event); });
      }
      $(navEl).prepend(el);
    });

    $('#backNav-button').click(function(){
      require('routers/router').instance().back();
    });
  }

  function render (view) {
    if (currentView && !currentView.options.isSingleton) {
      currentView.remove();
    }

    currentView = view;
    setupNav(view.navButtons || [], view);
    view.delegateEvents(view.events);
    return $(el).html(view.render().el);
  }

  this.render = render;
};

module.exports = BaseController;
