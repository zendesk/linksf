var Backbone = require('backbone'),
    $ = require('jquery');

var DetailView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/detail'),

  render: function() {
	var facility = this.model.toJSON();
	// var json = $('#results').data('results');
	// console.log("detail:", json);

    $(this.el).html(this.template({ model: facility }));
    return this;
  }
});

module.exports = DetailView;
