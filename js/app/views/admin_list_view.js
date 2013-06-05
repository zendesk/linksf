var ListView = require('views/list_view'), 
    $ = require('jquery');

var AdminListView = ListView.extend({
  template: require('templates/admin_list'), 
  defaultLimit: 4000,
  initialize: function() { 
    var self = this;
    this.listenTo(this.collection, 'reset', this.render);
    $('#search_form').submit(function(el) { 
      self.submitQuery({search: $('#search').val()});
      return false;
    });
  }
});

module.exports = AdminListView;
