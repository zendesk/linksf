var Backbone = require('backbone'),
    $        = require('jquery');

var IndexView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/index'),

  events: {
    'click ul.categories button': 'navigateToCategory'
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  navigateToCategory: function(event) {
    var route  = 'query/' + $(event.target).data('category'),
        router = require('routers/router').instance;

    router.navigate(route, { trigger: true });
  }
});

module.exports = IndexView;
