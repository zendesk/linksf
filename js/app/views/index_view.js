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
    'submit #searchForm': 'submit',
    'click ul.categories .btn': 'submit'
  },

  render: function() {
    this.$el.html(this.template({
      filter: false,
      categories: require('lib/categories')
    }));
    return this;
  },

  submit: function(event) {
    var categories   = [],
        keyWords     = this.$('#search_name').val(),
        category     = $(event.target).data('category');

    navigate([category], keyWords);
    return false;
  }
});

module.exports = IndexView;
