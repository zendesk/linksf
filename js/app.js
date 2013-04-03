$(function() {
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  var AppView = Backbone.View.extend({
    el: $("#linksf")
  });

  Facility = Parse.Object.extend('Facility', {
    defaults: function() {
      return {
        name:         '',
        address:      '',
        phone:        '',
        description:  '',
        notes:        '',
        hours:        {},
        gender:       null,
        age:          null,
        location:     null
      };
    },
  });

  Service = Parse.Object.extend('Service', {
    defaults: function() {
      return {
        name:         '',  // like 'showers', 'hiv testing'
        category:     '',  // 'hygiene'|'food'|'medical'|'shelter'|'technology'
        description:  '',
        notes:        '',
        hours:        {}
      };
    }
  });

  var App = new AppView;
});
