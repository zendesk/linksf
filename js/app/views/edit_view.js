var Backbone = require('backbone'),
    $ = require('jquery'),
	gmaps = require('google-maps');

var EditView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/edit'),
  render: function() {
    var g;
    $(this.el).html(this.template({facility: this.model.presentJSON()}));

    if ( (g = this.model.get('gender')) ) {
      $('#gender_' + g).prop('checked', true);
    } else {
      $('#gender_').prop('checked', true);
    }

    $("#age_everyone").click(function() {
      $('[name="age"]').prop('checked', $(this).prop('checked'));
    });

    if ( this.model.get("age") ) { 


    } else { 
      $("#age_everyone").click();
    }

    return this;
  }
});

module.exports = EditView;
