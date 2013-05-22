var Backbone = require('backbone'),
    $ = require('jquery'),
    Query = require('lib/query'),
    _ = require('underscore'),
    facilities = require('collections/facilities').instance;

function validCategory(category) {
  return category && (/[a-z]+/).test(category.toString());
}

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),

  events: {
    "click #filter": 'toggleSearch',
    "click .query .submit-query": 'doFilterQuery',
    "click .query .dismiss": 'dismissFilters'
  },

  toggleSearch: function() {
    this.$(".query").toggle();
  },

  doFilterQuery: function() {
    var sort = this.$(".query-option-sort .query-option.selected").data("value"),
        categories = this.$(".query-option-category .query-option.selected").map(function(n, el) { return $(el).data('value'); });

    var params = {
      filter: {
        categories: categories
      },
      sort: sort
    };

    Query.submit(params).done(function(results) {
      // populate with results
      facilities.reset(results.data);
    });

  },

  dismissFilters: function() {
    this.resetFilters();
    this.$(".query").hide();
    return false;
  },

  resetFilters: function() {
    this.$(".query .selected").removeClass("selected");
    this.$categoryOption(this.options.category).addClass("selected");
  },

  $categoryOption: function(category) {
    if(validCategory(category)) {
      return this.$(".query-option-category [data-value=" + category + "]").addClass("selected");
    } else {
      return $();
    }

  },

  submitQuery: function(extra_params) {
    // serialize the form
    var params = $('.query form').serializeObject();

    $.extend(params, extra_params);
    console.log(extra_params);
    // submit query
    params.limit = this.defaultLimit;

    Query.submit(params).done(function(results) {
      facilities.reset(results.data);
    });

    return false;
  },

  render: function() {
    var deepJson = this.deepToJson(this.collection);
    var templateJson = this.flattenServices(deepJson);

    // replace with template
    this.$el.html(this.template({ facilities: templateJson }));
    this.$('.query').hide();
    this.$('.option-group-exclusive .query-option').click(function() {
      $(this).closest(".option-group-exclusive").find(".query-option").removeClass("selected");
      $(this).toggleClass("selected");
    });

    this.$('.option-group .query-option').click(function() {
      $(this).toggleClass("selected");
    });

    this.resetFilters();
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
