var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

var AppView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/query_form'),

  onSubmit: function() {
    var params = $('#query').serializeObject();
    require('cloud/lib/query').submit(params);
    return false;
  },

  render: function() {
    $(this.el).html(this.template());
    $('#query').submit(this.onSubmit);
    return this;
  }
});

module.exports = AppView;
