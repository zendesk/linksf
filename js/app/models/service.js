module.exports = require('parse').Object.extend('Service', {
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
