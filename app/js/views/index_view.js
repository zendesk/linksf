var Analytics     = require('lib/analytics'),
    fetchLocation = require('shared/lib/fetch_location'),
    navigate      = require('shared/lib/navigate');

var IndexView = Backbone.View.extend({
  options: {},

  template: require('templates/index'),

  events: {
    'submit #search-form': 'submit',
    'click ul.filter-categories .btn': 'submit'
  },

  render: function() {
    this.$el.html(this.template({
      filter: false,
      categories: require('shared/lib/categories')
    }));
    return this;
  },

  submit: function(event) {
    var searchTerm = this.$('#search-term').val(),
        category   = $(event.target).data('value'),
        categories = [ category ];
        Analytics.trackHomepageAction(searchTerm, category);


    if ( searchTerm ) {
      navigate({categories: categories, search: searchTerm});
    } else {
      navigate({categories: categories, sort: "near"});
    }
    return false;
  }
});

module.exports = IndexView;
