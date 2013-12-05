var Hours = require('cloud/models/hours');

module.exports = Parse.Object.extend('Service', {
  hours: function() {
    if(this._hours) { return this._hours; }
    this._hours = Hours.fromData(this.get('openHours'));
    return this._hours;
  },

  presentJSON: function() {
    var json = this.toJSON();
    json.openHours = this.hours().humanize();
    json.condensedHours = this.hours().humanizeCondensed({shortDayNames: true});
    return json;
  }
});
