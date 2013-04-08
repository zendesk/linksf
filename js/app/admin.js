var $ = require('jquery');

$(function() {
  var Backbone = require('backbone');

  var AdminView = Backbone.View.extend({
    el: $("#linksf-admin"),
    render: function() {
      $(this.el).html('hellooooo');
      return this;
    }
  });

  Admin = new AdminView();
  Admin.render();
});