var Backbone = require('backbone'),
    $        = require('jquery');

function navigate(categories, searchTerm) {
  var router = require('routers/router').instance,
      route  = 'query?categories=' + categories.join(',');

  if ( searchTerm ) {
    route += '&search=' + encodeURIComponent(searchTerm);
  }

  router.navigate(route, { trigger: true });
}

var IndexView = Backbone.View.extend({
  template: require('templates/index'),

  events: {
    'submit #search-form': 'submit',
    'click ul.filter-categories .btn': 'submit'
  },

  render: function() {
    this.$el.html(this.template({
      filter: false,
      categories: require('lib/categories')
    }));
    return this;
  },

  submit: function(event) {
    var searchTerm = this.$('#search-term').val(),
        categories = [ $(event.target).data('value') ];

    navigate(categories, searchTerm);
    return false;
  }
});

module.exports = IndexView;
