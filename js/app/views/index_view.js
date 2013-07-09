var Backbone   = require('backbone'),
    $          = require('jquery'),
    _          = require('underscore');

function navigate(categories) {
  var route  = 'query/' + categories.join(','),
      router = require('routers/router').instance;

  router.navigate(route, { trigger: true });
}

var IndexView = Backbone.View.extend({
  template: require('templates/index'),

  events: {
    'click .search button': 'submit',
    'click ul.categories button': 'toggleCheckbox'
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  toggleCheckbox: function(event) {
    $(event.target).find('.icon-ok').toggle();
  },

  submit: function(event) {
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

module.exports = IndexView;
