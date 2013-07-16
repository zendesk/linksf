var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

function navigate(categories) {
  var route  = 'query/' + categories.join(','),
      router = require('routers/router').instance;

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
    this.$el.html(this.template());
    return this;
  },

  submitSearch: function() {
    var category,
        categories   = [],
        visibleIcons = this.$('.category .icon-ok:visible');

    _.each(visibleIcons, function(icon) {
      category = $(icon).closest('button').data('category');
      categories.push(category);
    });

    if (categories.length === 0) { return; }
    navigate(categories);
  }
});

module.exports = FilterView;
