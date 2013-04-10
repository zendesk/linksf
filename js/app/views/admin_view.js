var Backbone = require('backbone'),
    $ = require('jquery');

var AdminView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/admin'),
  render: function() {
    $(this.el).html(this.template());
    return this;
  }
});

module.exports = AdminView;
