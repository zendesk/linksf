var Backbone = require('backbone'),
    $        = require('jquery');

var IndexView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/index'),
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = IndexView;
