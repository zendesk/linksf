module.exports = require('parse').Object.extend('Facility', {
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
  }
});
