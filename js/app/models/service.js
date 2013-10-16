var Hours = require('models/hours');

module.exports = Parse.Object.extend('Service', { 
  hours: function() {
    if(this._hours) { return this._hours; }
    this._hours = Hours.fromData(this.get('openHours'));
    return this._hours;
  },
  humanizedHours: function() { 
    return this.hours().humanizeCondensed();
  }
});
