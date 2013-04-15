var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),
  render: function() {
    var facilities = this.collection.toJSON();
    $(this.el).html(this.template({ facilities: facilities }));
    return this;
  }
});

module.exports = ListView;
