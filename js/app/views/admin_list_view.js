var ListView = require('views/list_view'),
    $ = require('jquery');

function navigate(categories, searchTerm) {
  var route  = 'query?categories=' + categories.join(','),
      router = require('routers/admin_router').instance;
  router.navigate(route, { trigger: true });
}

var AdminListView = ListView.extend({
  template: require('templates/admin_list'),
  selectedCategory: '',

  events: {
    'click ul.filter-categories .btn': 'filter'
  },

  initialize: function() {
    var self = this;

    this.listenTo(this.collection, 'reset', this.render);

    $('#search-form').submit(function() {
      self.submitQuery({
        search: $('#search').val(),
        limit: 4000,
        sort: 'name'
      });

      return false;
    });
  },
  filter: function(event) {
    var categories = [ $(event.target).data('value') ];
    navigate(categories);
      return false;
  }
});

module.exports = AdminListView;
