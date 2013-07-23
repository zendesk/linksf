var Backbone	= require('backbone'),
    _           = require('underscore'),
    $			= require('jquery');

var AboutView = Backbone.View.extend({

  template: require('templates/about'),
  render: function() {
    $('#linksf').html(this.template());

    this.$('#backNav-button').click(function(){
      require('routers/router').instance.back();
    });
    return this;
  }
});

module.exports = AboutView;
