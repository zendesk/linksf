var Backbone = require('backbone'),
    $ = require('jquery');

var AdminView = Backbone.View.extend({
	el: $("#linksf-admin"),
	template: require('templates/login'),
	render: function() {
		$(this.el).html(this.template({ name: 'arf arf arf' }));
		return this;
	}
});

module.exports = AdminView;
