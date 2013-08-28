var _ = require('underscore');

var days = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

function fail(str) {
  throw new Error("Invalid time string: " + str);
}

var parseTime = function parseTime(str) {
  var match = str.match(/^(\d\d?)(:\d\d)?((?:A|P)M)$/i),
      hour, min, pm;

  if(!match || !match[1] || !match[3]) {
    fail(str);
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


/* Input format:

 {
   "Mon": "9:00AM-5:00PM",
   "Tue": "9:00AM-11:00AM,1:00PM-5:00PM",
   "Wed": "9:00AM-5:00PM",
   "Thu": "9:00AM-5:00PM",
   "Fri": "9:00AM-5:00PM",
   "Sat": "9:00AM-11:00AM",
   "Sun": "9:00AM-11:00AM"
 }

*/

var Hours = function Hours(hours){
  var processed = {}, day;

  this.hours = hours || {};
  for(var k in hours) {
    if(!hours.hasOwnProperty(k)) { continue; }
    day = days[k.toUpperCase()];

    processed[day] = this.parseDay(hours[k]);
  }

  this.hours = processed;
};

Hours.fromData = function(data) {
  var hours = new Hours();
  hours.hours = data;
  return hours;
};

Hours.prototype.addDay = function(day, str) {
  var dayNum = days[day.toUpperCase()];
  this.hours[dayNum] = this.parseDay(str);
};

Hours.prototype.parseDay = function(str) {
  var intervals, interval, result = [], times = [];

  intervals = str.split(",");

  for(var idx = 0; idx < intervals.length; idx++) {
    interval = intervals[idx].split("-");
    if(!interval[1]) { fail(str); }

    times = [ timeStringToOffset(interval[0]),
              timeStringToOffset(interval[1]) ];

    if(times[0] >= times[1]) { fail(str); }

    result.push(times);
  }

  return result;
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

Hours.prototype.serialize = function () {
  return this.hours;
};

Hours.prototype.isEmpty = function () {
  var count = 0;
  for(var k in this.hours) {
    if(!this.hours.hasOwnProperty(k)) { continue; }
    count++;
  }

  return (count === 0);
};

module.exports = Hours;
