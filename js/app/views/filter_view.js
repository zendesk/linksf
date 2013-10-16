var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

function navigate(options) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance;

  if (options.categories.length > 0) {
     params.push("categories=" + options.categories.join(","));
  }

  if (options.demographics.length > 0) {
    params.push("demographics=" + options.demographics.join(","));
  }

  if (options.gender) {
    params.push("gender=" + options.gender);
  }

  if (params.sort) {
    params.push("sort=" + options.sort);
  }

  if (params.length > 0) {
    route = route + "?" + params.join("&");
  }

  router.navigate(route, { trigger: true });
}

function setFilterOptions(view) {
  var params       = view.options.params,
      categories   = _.compact((params.categories || '').split(',')),
      demographics = _.compact((params.demographics || '').split(',')),
      gender       = params.gender,
      sort         = params.sort;

  categories.forEach(function(category) {
    view.$('.filter-categories .btn[data-value="' + category + '"]').button('toggle');
  });

  demographics.forEach(function(demographic) {
    view.$('.filter-demographics .btn[data-value="' + demographic + '"]').button('toggle');
  });

  if (gender) {
    view.$('.filter-gender .btn[data-value="' + gender + '"]').button('toggle');
  }

  if (sort === 'name') {
    view.$('.filter-sort .btn[data-value="name"]').button('toggle');
  }
}

var FilterView = Backbone.View.extend({
  template: require('templates/filter'),
  events: {
    "click .search .search-button": "submitSearch",
    "click #backNav-button": "goBack",
    "click #searchNav-button": "submitSearch",
    'click ul.filter-categories .category': 'toggleCategory'
  },

  toggleCategory: function(event) {
    $(event.target).toggleClass('active');
  },

  render: function() {
    var distanceDisabled = this.options.currentLocation ? false : 'disabled';

    this.$el.html(this.template({
      navButtons: [
        {class: 'left', id: 'backNav-button', text: 'Back'},
        {class: 'right', id: 'searchNav-button', text: 'Search'}
      ],
      categories:       require('lib/categories'),
      filter:           true,
      distanceDisabled: distanceDisabled
    }));

    _.defer(setFilterOptions, this);

    return this;
  },

  goBack: function() {
    var router = require('routers/router').instance;
    router.back();
  },

  submitSearch: function() {
    var categories   = [],
        demographics = [],
        gender = null,
        sort = null;

    categories = this.$('.filter-categories .btn.active').toArray().map(function(el) {
      return $(el).data('value');
    });

    demographics = this.$(".filter-demographics .btn.active").toArray().map(function(el) {
      return $(el).data("value");
    });

    gender = this.$(".filter-gender .btn.active").data("value");

    if(gender === "A") {
      gender = null;
    }

    sort = this.$(".filter-sort .btn.active").data("value");

    navigate({
      categories: categories,
      demographics: demographics,
      gender: gender,
      sort: sort
    });
  }
});

module.exports = FilterView;
