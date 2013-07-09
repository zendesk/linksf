/* globals window */
var Backbone = require('backbone'),
    $ = require('jquery'),
    Query = require('lib/query'),
    InfiniteScrollControl = require('lib/scroll'),
    _ = require('underscore'),
    facilities = require('collections/facilities').instance,
    searchParams = ["fr"];

function validCategory(category) {
  return category && (/[a-z]+/).test(category.toString());
}

function getData($elements, dataAttrName) {
  var result = [];
  $elements.each(function(n, el) {
    result.push($(el).data(dataAttrName));
  });
  return result;
}

var CATEGORIES = [
  {
    key: "food",
    title: "Food",
    icon: "shopping-cart"

  },
  {
    key: "medical",
    title: "Medical",
    icon: "heart"
  },
  {
    key: "housing",
    title: "Housing",
    icon: "briefcase"
  },
  {
    key: "technology",
    title: "Technology",
    icon: "hdd"
  },
  {
    key: "hygiene",
    title: "Hygiene",
    icon: "tint"
  }
];

var ListView = Backbone.View.extend({
  template: require('templates/list'),

  events: {
    "click #filter": 'toggleSearch',
    "click .query .submit-query": 'doFilterQuery',
    "click .query .dismiss": 'dismissFilters'
  },

  initialize: function() {
    this.listenTo(this.collection, 'reset', this.render);

    var self = this;
    this.scrollControl = new InfiniteScrollControl(function loadData(loadCompleteCallback) {
      $('#loading-spinner').show();

      Query.submit(self.getFilterParams()).done(function(results) {
        if ( results.data.length === 0 ) {
          loadCompleteCallback(false);
        }

        facilities.add(results.data);
        facilities.trigger("reset");
        self.offset = results.offset;
        $('#loading-spinner').hide();
        loadCompleteCallback(true);
      });
    });

    $(window).scroll(function () {
      self.scrollControl.triggerScroll();
    });
  },

  toggleSearch: function() {
    this.$(".query").toggle();
  },

  getFilterParams: function () {
    var sort = this.$(".query-option-sort .query-option.selected").data("value"),
        categories = getData(this.$(".query-option-category .query-option.selected"), 'value'),
        gender = this.$(".query-option-gender .query-option.selected").data('value'),
        age = getData(this.$(".query-option-demographics .query-option.selected"), 'value');

    if(gender === "A") {
      gender = null;
    }

    this.options.categories = categories;

    if(categories.length === 0) {
      categories = _.map(CATEGORIES, function(c) { return c.key; });
    }

    return {
      filter: {
        categories: categories,
        age: age,
        gender: gender
      },
      sort: sort,
      offset: this.offset
    };
  },

  doFilterQuery: function() {
    this.offset = 0;
    this.scrollControl.isDisabled = false;
    this.performQuery(this.getFilterParams()).done(function(results) {
      var router = require('routers/router').instance;
      router.navigate("list");
    });
  },

  performQuery: function(params) {
    return Query.submit(params).done(function(results) {
      searchParams = params;
      // populate with results
      facilities.reset(results.data);
      this.offset = results.offset;
    }.bind(this));
  },

  dismissFilters: function() {
    this.resetFilters();
    this.$(".query").hide();
    return false;
  },

  resetFilters: function() {
    this.$(".query .selected").removeClass("selected");
    var self = this;
    _.each(this.options.categories, function(category) {
      self.$categoryOption(category).addClass("selected");
    });

    this.$(".query-option-gender [data-value='A']").addClass('selected');
  },

  $categoryOption: function(category) {
    if(validCategory(category)) {
      return this.$(".query-option-category [data-value=" + category + "]").addClass("selected");
    } else {
      return $();
    }

  },

  render: function() {
    var deepJson = this.deepToJson(this.collection);
    var templateJson = this.flattenServices(deepJson);

    // replace with template
    this.$el.html(this.template({
      facilities: templateJson,
      categories: CATEGORIES,
      searchParams: this.filterSelectCategories(this.options.categories)
    }));
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
  },
  filterSelectCategories: function(queryParams) {
    var selectedCategories = [];
    _.each(queryParams, function(queryName){
      var match = _.find(CATEGORIES, function(e){ return e.key == queryName; });
      selectedCategories.push(match);
    });
    return selectedCategories;
  }
});

module.exports = ListView;
