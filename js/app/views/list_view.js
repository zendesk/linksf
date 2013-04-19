var Backbone = require('backbone'),
    $ = require('jquery'),
    Query = require('lib/query'),
    facilities = require('collections/facilities').instance;

var ListView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/list'),

  submitQuery: function() {
    // serialize the form
    var params = $('#query').serializeObject(),
        self = this;

    // submit query

    Query.submit(params).done(function(results) {
      // populate with results
      facilities.reset(results.data);
    });

    // prevent default form submission
    return false;
  },

  render: function() {
    var jsonFacilities = this.collection.toJSON();

    // replace with template
    $(this.el).html(this.template({ facilities: jsonFacilities }));

    // bind to form submission
    $('#query').submit($.proxy(this.submitQuery, this));
    return this;
  }
});

module.exports = ListView;
