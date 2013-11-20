function navigate(options) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance();

  if (options.categories.length > 0) {
    params.push("categories=" + options.categories.join(","));
  }

  if (options.demographics.length > 0) {
    params.push("demographics=" + options.demographics.join(","));
  }

  [ "gender", "sort", "hours" ].forEach(function(key) {
    if (options[key]) {
      params.push(key + "=" + options[key]);
    }
  });

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
      sort         = params.sort,
      hours        = params.hours;

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

  if (hours === 'open') {
    view.$('.filter-hours .btn[data-value="open"]').button('toggle');
  }
}

var FilterView = Backbone.View.extend({
  constructor: function (options) {
    Backbone.View.apply(this, arguments);
    this.options = options;
  },

  navButtons: [
    {class: 'left', id: 'backNav-button', text: 'Back'},
    {class: 'right', id: 'searchNav-button', text: 'Search', action: 'submitSearch'}
  ],

  template: require('templates/filter'),

  events: {
    "click .search .search-button": "submitSearch",
    'click ul.filter-categories .category': 'toggleCategory'
  },

  toggleCategory: function(event) {
    $(event.target).toggleClass('active');
  },

  render: function() {
    var distanceDisabled = this.options.currentLocation ? false : 'disabled';

    this.$el.html(this.template({
      categories:       require('shared/lib/categories'),
      filter:           true,
      distanceDisabled: distanceDisabled
    }));

    _.defer(setFilterOptions, this);

    return this;
  },

  submitSearch: function() {
    var categories   = [],
        demographics = [],
        gender       = null,
        sort         = null,
        hours        = null;

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

    hours = this.$(".filter-hours .btn.active").data("value");
    if (hours == "A") { hours = null; }

    navigate({
      categories:   categories,
      demographics: demographics,
      gender:       gender,
      sort:         sort,
      hours:        hours
    });
  }
});

module.exports = FilterView;
