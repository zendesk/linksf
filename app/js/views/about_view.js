var AboutView = Backbone.View.extend({
  options: {},

  template: require('../templates/about.hbs'),
  navButtons: [
    { 'class': 'left', id: 'backNav-button', text: '<i class="icon-left-open back"></i> BACK' }
  ],

  render: function() {
    this.$el.html(this.template());

    return this;
  }
});

module.exports = AboutView;
