var Backbone = require('backbone'),
    $ = require('jquery');

var AdminView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/admin'),
  render: function() {
    console.log('template is', this.template());
    console.log('element is', $(this.el).html());
    console.log('rendering admin!');
    $(this.el).html(this.template());
    return this;
  }
});

module.exports = AdminView;
