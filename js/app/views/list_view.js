var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),
  facilities: function() {
    var models, jsonModels;

    models = $('#results').data('results');
    jsonModels = _.map(models, function(model) { return model.toJSON(); });

    return jsonModels;
  },
  render: function() {
    $(this.el).html(this.template({ facilities: this.facilities() }));
    return this;
  }
});

module.exports = ListView;
