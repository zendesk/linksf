var Backbone = require('backbone'),
    $        = require('jquery');

function setup($el) {
  $el.find('ul.categories li button').click(function() {
    var route = 'query/' + $(this).data('category'),
        router = require('routers/router').instance;

    router.navigate(route, { trigger: true });
  });
}

var IndexView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/index'),
  render: function() {
    this.$el.html(this.template());
    setup(this.$el);
    return this;
  }
});

module.exports = IndexView;
