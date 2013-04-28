var _ = require('lodash');

var days = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

var parseTime = function parseTime(str) {
  var match = str.match(/(\d\d?)(:\d\d)?((?:A|P)M)/i),
      hour, min, pm;

  if(!match || !match[1] || !match[3]) {
    throw new Error("Invalid time string: " + str);
  }

  hour = parseInt(match, 10);
  if(match[2]) {
    min = parseInt(match[2].replace(":",""), 10);
  } else {
    min = 0;
  }

  pm = !!match[3].match(/PM/i);

  if(pm && hour !== 12) {
    return [(hour + 12), min];
  } else {
    return [hour, min];
  }
};

var timeToOffset = function(time) {
  return time.getHours()*100 + time.getMinutes();
};

var timeStringToOffset = function(timeString) {
  var parsed = parseTime(timeString);
  return parsed[0]*100 + parsed[1];
};

var Hours = function Hours(hours){
  var processed = {}, intervals, interval, day;

  for(var k in hours) {
    if(!hours.hasOwnProperty(k)) { continue; }

    day = days[k.toUpperCase()];
    processed[day] = [];
    intervals = hours[k].split(",");

    for(var idx = 0; idx < intervals.length; idx++) {
      interval = intervals[idx].split("-");
      processed[day].push([ timeStringToOffset(interval[0]),
                            timeStringToOffset(interval[1]) ]);
    }
  }

  this.hours = processed;
};

Hours.prototype.within = function(time) {
  var intervals, instant, parts, day;

  if(_.isDate(time)) {
    intervals = this.hours[time.getDay()];
    instant   = timeToOffset(time);
  } else {
    parts      = time.split(","),
    day        = days[parts[0].toUpperCase()],
    intervals  = this.hours[day],
    instant    = timeStringToOffset(parts[1]);
  }

  return !!_(intervals).find(function(interval) {
    return (interval[0] <= instant) &&
           (interval[1] >= instant);
  });
};

module.exports = Hours;
