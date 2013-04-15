var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),

  facilities: function() {
    var models, jsonModels;

    models = $('#results').data('results');
    var collection = new Backbone.Collection(models);
    console.log(collection);
    jsonModels = _.map(models, function(model) { return model.toJSON(); });
    console.log(collection.toJSON());

    return collection.toJSON();
  },

  render: function() {
    $(this.el).html(this.template({ facilities: this.facilities() }));
    return this;
  }
});

module.exports = ListView;
