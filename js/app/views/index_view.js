var Backbone   = require('backbone'),
    $          = require('jquery'),
    _          = require('underscore');

function navigate(categories, keyWords) {
  var route  = 'query?categories=' + categories.join(',') + '&search=' + encodeURIComponent(keyWords),
      router = require('routers/router').instance;

  router.navigate(route, { trigger: true });
}

var IndexView = Backbone.View.extend({
  template: require('templates/index'),

  events: {
    'click .search-button': 'submit',
    'submit #searchForm': 'submit',
    'click ul.categories .btn': 'toggleCheckbox'
  },

  render: function() {
    this.$el.html(this.template({}));
    return this;
  },

  toggleCheckbox: function(event) {
    $(event.target).find('.icon-ok').toggle();
    return false;
  },

  submit: function(event) {
    var category,
        categories   = [],
        keyWords     = this.$('#search_name').val(),
        visibleIcons = this.$('.category .icon-ok:visible');

    _.each(visibleIcons, function(icon) {
      category = $(icon).closest('button').data('category');
      categories.push(category);
    });

    if (categories.length === 0 && keyWords === '') { return; }
    navigate(categories, keyWords);
    return false;
  }
});

module.exports = IndexView;
