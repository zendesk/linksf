var ListView = require('shared/views/list_view');

function navigate(category) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance();
      if ( category.length > 0 ) {
        params.push( "categories=" + category );
      }
      if (params.length > 0) {
        route = route + "?" + params.join("&");
      }
      router.navigate(route, { trigger: true });
}

var AdminListView = ListView.extend({
  template: require('templates/admin_list'),
  selectedCategory: '',

  events: {
    'click .category.btn': 'filter'
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
    var category = $(event.target).data('value');
    navigate(category);
    return false;
  }
});

module.exports = AdminListView;
