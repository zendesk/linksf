$(function() {
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  var AppView = Backbone.View.extend({
    el: $("#linksf")
  });

  Facility = Parse.Object.extend('Facility', {
    defaults: function() {
      return {
        name:         'glide sf',
        address:      '123 street',
        description:  'a place with services',
        phone:        '(111)222-3333',
        hours:        {},
        notes:        'line up early!',
        gender:       null,
        age:         null,
        location:     null
      };
    },
  });

  Service = Parse.Object.extend('Service', {
    defaults: function() {
      return {
        name:         'showers',  // like 'showers', 'hiv testing'
        category:     'hygiene',  // 'hygiene'|'food'|'medical'|'shelter'|'technology'
        description:  null,
        hours:        null,
        notes:        null
      };
    }
  });

  var App = new AppView;
});
