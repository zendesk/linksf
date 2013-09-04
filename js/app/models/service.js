var Hours = require('models/hours');

module.exports = Parse.Object.extend('Service', { 

  hours: function() {
    if(this._hours) { return this._hours; }
    this._hours = new Hours(this.get('hours'));
    return this._hours;
  }
});
