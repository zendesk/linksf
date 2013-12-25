var fetchLocation = require('shared/lib/fetch_location'),
    navigate = require('shared/lib/navigate');

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
        categories = [ $(event.target).data('value') ];


    if ( searchTerm ) {
      navigate({categories: categories, search: searchTerm});
    } else {
      fetchLocation().always(function(loc) {
        if(loc.lat && loc.lon) {
          navigate({categories: categories, sort: "near"});
        } else {
          navigate({categories: categories});
        }
      });
    }
    return false;
  }
});

module.exports = IndexView;
