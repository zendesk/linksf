var ListView = require('../../../shared/js/views/list_view');
var navigate = require('../../../shared/js/lib/navigate');

var AdminListView = ListView.extend({
  template: require('../../js/templates/list.hbs'),
  selectedCategory: '',

  events: {
    'click .category.btn': 'filter'
  },

  initialize: function() {
    var self = this;
    this.listenTo(this.collection, 'reset', this.render);
  },

  filter: function(event) {
    var category = $(event.target).data('value');
    navigate({categories: [category]});
    return false;
  }
});

module.exports = AdminListView;
