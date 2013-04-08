var Backbone = require('Backbone');

var AdminView = Backbone.View.extend({
	el: $("#linksf-admin"),
	render: function() {
		$(this.el).html('hellooooo');
		return this;
	}
});

module.exports = AdminView;
