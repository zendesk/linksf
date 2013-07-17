var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

function navigate(options) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance;

  if(options.categories.length > 0) {
     params.push("categories=" + options.categories.join(","));
  }

  if(options.demographics.length > 0) {
    params.push("demographics=" + options.demographics.join(","));
  }

  if(options.gender) {
    params.push("gender=" + options.gender);
  }

  if(params.length > 0) {
    route = route + "?" + params.join("&");
  }

  router.navigate(route, { trigger: true });
}

var FilterView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/filter'),
  events: {
    "click .search .search-button": "submitSearch",
    'click ul.categories button': 'toggleCheckbox'
  },

  toggleCheckbox: function(event) {
    $(event.target).find('.icon-ok').toggle();
  },

  render: function() {
    this.$el.html(this.template({
      navButtons: [
        {class: 'left', text: 'Back'},
        {class: 'right', text: 'Search'}
      ]
    }));
    return this;
  },

  submitSearch: function() {
    var category,
        categories   = [],
	demographics = [],
	gender = null,
	sort = null,
        visibleIcons = this.$('.category .icon-ok:visible');

    _.each(visibleIcons, function(icon) {
      category = $(icon).closest('button').data('category');
      categories.push(category);
    });

    demographics = this.$(".filter-demographics .btn.active").toArray().map(function(el) {
      return $(el).data("value");
    });

    gender = this.$(".filter-gender .btn.active").data("value");

    if(gender === "A") {
      gender = null;
    }

    sort = this.$(".filter-sort .btn.active").data("value");

    if (categories.length === 0) { return; }
    navigate({
      categories: categories,
      demographics: demographics,
      gender: gender,
      sort: sort
    });
  }
});

module.exports = FilterView;
