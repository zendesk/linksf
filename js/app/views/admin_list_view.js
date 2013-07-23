var ListView = require('views/list_view'), 
    $ = require('jquery');

var AdminListView = ListView.extend({
  template: require('templates/admin_list'), 
  defaultLimit: 4000,
  events: { },
  initialize: function() { 
    var self = this;
    this.listenTo(this.collection, 'reset', this.render);
    $('#search_form').submit(function(el) { 
      self.submitQuery({search: $('#search').val()});
      return false;
    });
  },

  submitQuery: function(extra_params) {
    // serialize the form
    var params = $('.query form').serializeObject();

    $.extend(params, extra_params);
    console.log(extra_params);
    // submit query
    params.limit = this.defaultLimit;
    this.performQuery(params);

    return false;
  }

});

module.exports = AdminListView;
