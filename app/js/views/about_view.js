var AboutView = Backbone.View.extend({
  template: require('templates/about'),

  render: function() {
    this.$el.html(this.template({
      navButtons: [
        { class: 'left', id: 'backNav-button', text: 'Back' }
      ]
    }));

    this.$('#backNav-button').click(function(){
      require('routers/router').instance.back();
    });

    return this;
  }
});

module.exports = AboutView;
