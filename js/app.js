$(function() {
  var AppView = Backbone.View.extend({
    el: $("#linksf")
  });

  var Facility = Backbone.Model.extend({
    defaults: function() {
      return {
        name:         'glide sf',
        addr:         '123 street',
        description:  'a place with services',
        phone:        '(111)222-3333',
        hours:        {},
        notes:        'line up early!',
        demographics: [],
        geopoint:     {}
      };
    },

  });

  var Service = Backbone.Model.extend({
    defaults: function() {
      return {
        facilityId:   'glide sf', // reference to Facility
        name:         'showers',  // like 'showers', 'hiv testing'
        category:     'hygiene',  // 'hygiene'|'food'|'medical'|'shelter'|'technology'
        hours:        {},
        notes:        '3 showers',
        demographics: []          // maybe?  unclear whether necessary 
      };
    }
  });

  var App = new Appview;
});
