var navigate = require('../../../shared/js/lib/navigate');

function setFilterOptions(view) {
  var params       = view.options.params,
      categories   = _.compact((params.categories || '').split(',')),
      demographics = _.compact((params.demographics || '').split(',')),
      gender       = params.gender,
      sort         = params.sort,
      hours        = params.hours;

  categories.forEach(function(category) {
    view.$('.categories .btn[data-value="' + category + '"]').button('toggle');
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

  view.$('div[role=radiogroup]').click(function(event) {
    if ($(event.target).attr("role") != 'radio') { return; }
    var radiogroup = $(this),
        oldOpt = radiogroup.find('button[aria-checked="true"]');

    $(oldOpt).attr('aria-checked', false);
    $(event.target).attr('aria-checked', true);
  });

  view.$('button[role=checkbox]').click(function() {
    var button = $(this);
    button.attr('aria-checked', !button.hasClass('active'));
  });

  view.$('button[role=checkbox], button[role=radio]').each(function() {
    var button = $(this);
    button.attr('aria-checked', button.hasClass('active'));
    button.attr('aria-describedby', button.parent().attr('aria-describedby'));
  });
}

var FilterView = Backbone.View.extend({
  constructor: function (options) {
    Backbone.View.apply(this, arguments);
    this.options = options;
  },

  navButtons: [
    {'class': 'left', id: 'backNav-button', text: '<i class="icon-left-open back"></i> BACK'},
    {'class': 'right', id: 'searchNav-button', text: 'SEARCH', action: 'submitSearch'}
  ],

  template: require('../templates/filter.hbs'),

  events: {
    "click .search .search-button": "submitSearch",
    'click ul.categories .category': 'toggleCategory'
  },

  toggleCategory: function(event) {
    $(event.target).toggleClass('active');
  },

  render: function() {
    var distanceDisabled = this.options.currentLocation ? false : 'disabled';

    this.$el.html(this.template({
      categories:       require('cloud/lib/categories'),
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

    categories = this.$('.categories .btn.active').toArray().map(function(el) {
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
    if (hours === "A") { hours = null; }

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
