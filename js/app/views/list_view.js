var Backbone = require('backbone'),
    $ = require('jquery');

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),
  render: function() {
    $(this.el).html(this.template());
    return this;
  }
});

module.exports = ListView;
