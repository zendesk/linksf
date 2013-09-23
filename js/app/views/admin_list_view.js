var ListView = require('views/list_view'),
    $ = require('jquery');

var AdminListView = ListView.extend({
  template: require('templates/admin_list'),

  events: {},

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
  }
});

module.exports = AdminListView;
