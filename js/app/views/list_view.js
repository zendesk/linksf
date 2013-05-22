var Backbone = require('backbone'),
    $ = require('jquery'),
    Query = require('lib/query'),
    _ = require('underscore'),
    Handlebars = require('handlebars-runtime'),
    facilities = require('collections/facilities').instance;

Handlebars.registerPartial("facilityStatus", require('templates/facility_status'));

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),

  events: {
    "click #filter": 'toggleSearch'
  },

  toggleSearch: function() {
    this.$("#query").toggle();
  },

  submitQuery: function(extra_params) {
    // serialize the form
    var params = $('#query').serializeObject();

    $.extend(params, extra_params);
    console.log(extra_params);
    // submit query
    params.limit = this.defaultLimit;

    Query.submit(params).done(function(results) {
      // populate with results
      facilities.reset(results.data);
    });

    // prevent default form submission
    return false;
  },

  render: function() {
    var deepJson = this.deepToJson(this.collection);
    var templateJson = this.flattenServices(deepJson);

    // replace with template
    $(this.el).html(this.template({ facilities: templateJson }));
    $('#query').hide();

    // bind to form submission
    $('#query').submit($.proxy(this.submitQuery, this));
    return this;
  },

  deepToJson: function(collection) {
    var json = [],
        modelJson;

    json = _.map(collection.models, function(model) {
      modelJson = model.toJSON();
      modelJson.services = [];
      _.each(model.attributes.services, function(service) {
        modelJson.services.push(service.toJSON());
      });
      return modelJson;
    });

    return json;
  },

  flattenServices: function(jsonArray) {
    var serviceCategories,
        allNotes,
        flattened = [];

    _.each(jsonArray, function(jsonModel) {
      serviceCategories = [];
      allNotes = [];
      _.each(jsonModel.services, function(jsonService) {
        serviceCategories.push(jsonService.category);
        allNotes.push(jsonService.notes);
      });
      jsonModel.serviceCategories = serviceCategories.join(', ');
      jsonModel.allNotes = allNotes.join(' ');
      flattened.push(jsonModel);
    });

    return flattened;
  }
});

module.exports = ListView;
