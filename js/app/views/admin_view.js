var Backbone = require('Backbone');

var AdminView = Backbone.View.extend({
	el: $("#linksf-admin"),
	template: require('../templates/login.hbs'),
	render: function() {
		$(this.el).html(this.template({ name: 'arf arf arf' }));
		return this;
	}
});

module.exports = AdminView;
