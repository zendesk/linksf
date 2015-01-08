var Analytics     = require('../../../shared/js/lib/analytics'),
    fetchLocation = require('../../../shared/js/lib/fetch_location'),
    navigate      = require('../../../shared/js/lib/navigate');

var IndexView = Backbone.View.extend({
  options: {},

  template: require('../templates/index.hbs'),

  events: {
    'submit #search-form': 'submit',
    'click ul.categories .btn': 'submit'
  },

  render: function() {
    this.$el.html(this.template({
      filter: false,
      categories: require('cloud/lib/categories')
    }));
    return this;
  },

  submit: function(event) {
    var category   = $(event.target).data('value'),
        categories = [ category ];
        Analytics.trackHomepageAction(category);

    navigate({categories: categories, sort: "near"});
    return false;
  }
});

module.exports = IndexView;
