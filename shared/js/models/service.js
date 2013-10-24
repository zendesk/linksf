var Hours = require('./hours.js');

module.exports = Parse.Object.extend('Service', {

  hours: function() {
    if(this._hours) { return this._hours; }
    this._hours = Hours.fromData(this.get('openHours'));
    return this._hours;
  }
});
