var Backbone = require('backbone'),
    $ = require('jquery');

var AppView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/query_form'),
  render: function() {
    $(this.el).html(this.template());
    return this;
  }
});

module.exports = AppView;
