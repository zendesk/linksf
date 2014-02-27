var FeedbackView = Backbone.View.extend({
  options: {},

  template: require('templates/feedback'),
  events: {
	'submit #feedback-form': 'sendFeedback'
  },
  navButtons: [
    { 'class': 'left', id: 'backNav-button', text: 'Back' }
  ],
  sendFeedback: function() {
	Parse.Cloud.run('sendFeedback', this.$('#feedback-form').serializeObject()).then(
		function() {
			Backbone.history.navigate('index', { trigger: true });
		},
		function() {
			this.$('.feedback-error').show();
		}.bind(this)
	);
	return false;
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = FeedbackView;
