var FeedbackView = Backbone.View.extend({
  options: {},

  template: require('../templates/feedback.hbs'),
  events: {
	'submit #feedback-form': 'sendFeedback'
  },
  navButtons: [
    { 'class': 'left', id: 'backNav-button', text: 'Back' }
  ],
  sendFeedback: function() {
  this.$('input[name=user_agent]').val(window.navigator.userAgent);
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
