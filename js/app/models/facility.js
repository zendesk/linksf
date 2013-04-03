module.exports = require('parse').Object.extend('Facility', {
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
  }
});
