var AboutView = Backbone.View.extend({
  options: {},

  template: require('templates/about'),
  navButtons: [
    { class: 'left', id: 'backNav-button', text: 'Back' }
  ],

  render: function() {
    this.$el.html(this.template());

    return this;
  }
});

module.exports = AboutView;
