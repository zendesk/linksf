var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    Handlebars = require('handlebars-runtime'),
    gmaps = require('google-maps');

Handlebars.registerPartial("editService", require('templates/edit_service'));

var EditView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/edit'),
  setupServices: function() {
    _(this.model.get("services")).each(function(service, index) { 
      var prefix = "#service\\[" + index + "\\]";

      $(prefix + "_category").children("[value='" + service.get('category') + "']").prop('selected', true);
    });
  },
  setupForm: function() {
    var g = this.model.get('gender');
    var el;

    el = $('#gender_' + (g ? g : ''));
    el.prop('checked', true); 

    $("#age_everyone").click(function() {
      $('[name="age"]').prop('checked', $(this).prop('checked'));
    });

    if ( this.model.get("age") ) { 
      _(this.model.get("age")).each(function(age) {
        $("#age_" + age.toUpperCase()).prop('checked', true);
      });
    } else { 
      $("#age_everyone").click();
    }

    this.setupServices();
  },
  render: function() {
    $(this.el).html(this.template({facility: this.model.presentJSON()}));
    this.setupForm();
    return this;
  }
});

module.exports = EditView;
