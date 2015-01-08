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
      var el = $("<button type='button' class='unselectable'>").addClass(button['class']).attr("id", button.id).html(button.text);

      if ( button.action ) {
        el.click(function(event) { return view[button.action].call(view.event); });
      }
      $(navEl).prepend(el);
    });

    $('#backNav-button').click(function(){
      require('../../../app/js/routers/router').instance().back();
    });
  }

  function render (view) {
    var ret;
    if (currentView && !currentView.options.isSingleton) {
      currentView.remove();
    }

    currentView = view;
    setupNav(view.navButtons || [], view);
    ret = $(el).html(view.render().el);

    if ( view.afterRender )
      view.afterRender();

    view.delegateEvents(view.events);
    return ret;
  }

  this.render = render;
};

module.exports = BaseController;
