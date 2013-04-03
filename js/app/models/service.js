module.exports = require('parse').Object.extend('Service', {
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
