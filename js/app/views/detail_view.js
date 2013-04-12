var Backbone = require('backbone'),
    $ = require('jquery');

var DetailView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/detail'),
  render: function() {
	console.log("detail");
    $(this.el).html(this.template());
    return this;
  }
});

module.exports = DetailView;
