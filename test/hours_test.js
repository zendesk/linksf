/*globals describe, it, beforeEach*/

var should = require("should");
describe("Hours", function(){
  var Hours = require('../js/app/models/hours'),
      hours;

  beforeEach(function() {
    hours = new Hours({
      Sun: "9AM-6PM",
      Mon: "9AM-12PM,2PM-5PM",
      Tue: "9AM-6PM",
      Wed: "9AM-6PM",
      Thu: "9AM-6PM",
      Fri: "9AM-6PM",
      Sat: "9:00AM-11:00AM,2pm-5:30pm"
    });

  });

  describe("creating", function() {

    it("should convert text times to offsets", function() {
      hours.hours.should.eql({
        0: [[900,1800]],
        1: [[900,1200], [1400,1700]],
        2: [[900,1800]],
        3: [[900,1800]],
        4: [[900,1800]],
        5: [[900,1800]],
        6: [[900,1100], [1400, 1730]]
      });
    });

    describe("input validation", function() {
      it("should deal with garbage", function() {
        (function() { hours.addDay("Mon", ""); }).should.throwError(/Invalid time/);
        (function() { hours.addDay("Mon", "4pm"); }).should.throwError(/Invalid time/);
        (function() { hours.addDay("Mon", "abcd"); }).should.throwError(/Invalid time/);
        (function() { hours.addDay("Mon", "9PM-10PMgarbage"); }).should.throwError(/Invalid time/);

      });

      it("should deal with bad intervals", function() {
        (function() { hours.addDay("Mon", "9PM-9PM"); }).should.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "9PM-9AM"); }).should.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "4:30PM-12:00AM"); }).should.not.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "9:30AM-12:00AM"); }).should.not.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "9:30AM-12:30AM"); }).should.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "12:00AM-11:59PM"); }).should.not.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "12:00AM-12:00AM"); }).should.not.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "12:00AM-50PM"); }).should.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "12:00AM-50:00PM"); }).should.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "12:00AM-50AM"); }).should.throwError(/Invalid time/);

      (function() { hours.addDay("Mon", "12:00AM-50:00AM"); }).should.throwError(/Invalid time/);
      });

      it("should allow spaces", function() {
        (function() { hours.addDay("Mon", "9am-10am, 11am-12pm"); }).should.not.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "9 am-10 am, 11 am-12 pm"); }).should.not.throwError(/Invalid time/);

        (function() { hours.addDay("Mon", "9:00 AM - 12:00 PM, 2:00 PM - 5:00 PM"); }).should.not.throwError(/Invalid time/);

      });

    });
  });

  describe("#humanize", function() {
    beforeEach(function() {
      hours = new Hours({
        Sun: "9AM-6PM",
        Mon: "9AM-12PM,2PM-5PM",
        Tue: "9AM-12AM",
        Wed: "9AM-6PM",
        Thu: "9AM-6PM",
        Fri: "9AM-6PM",
        Sat: "9:00AM-11:00AM,2pm-5:30pm"
      });
    });

    it("should convert back to AM/PM strings", function() {
      hours.humanize().should.eql({
        "SUN": "9:00AM-6:00PM",
        "MON": "9:00AM-12:00PM,2:00PM-5:00PM",
        "TUE": "9:00AM-12:00AM",
        "WED": "9:00AM-6:00PM",
        "THU": "9:00AM-6:00PM",
        "FRI": "9:00AM-6:00PM",
        "SAT": "9:00AM-11:00AM,2:00PM-5:30PM"
      });
    });

  });

  describe("#addDay", function() {
    beforeEach(function() {
      hours = new Hours();
    });

    it("should add open hours per day", function() {
      hours.addDay("Sun", "9AM-6PM");
      hours.addDay("Mon", "9AM-12PM,2PM-5PM");
      hours.addDay("Tue", "9AM-6PM");
      hours.addDay("Wed", "9AM-6PM");
      hours.addDay("Thu", "9AM-6PM");
      hours.addDay("Fri", "9AM-6PM");
      hours.addDay("Sat", "9AM-6PM");

      hours.hours.should.eql({
        0: [[900,1800]],
        1: [[900,1200], [1400,1700]],
        2: [[900,1800]],
        3: [[900,1800]],
        4: [[900,1800]],
        5: [[900,1800]],
        6: [[900,1800]]
      });

    });

  });

  describe("#within", function(){
    it("should work with strings", function() {
      hours.within("Sun,10:30AM").should.equal(true);
      hours.within("Mon,10:30AM").should.equal(true);
      hours.within("Mon,12:30PM").should.equal(false);
    });

    it("should work with dates", function() {
      hours.within(new Date(2013, 3, 7, 10, 30)).should.equal(true);
      hours.within(new Date(2013, 3, 1, 10, 30)).should.equal(true);
      hours.within(new Date(2013, 3, 1, 12, 30)).should.equal(false);
    });

  });

  describe("#isEmpty", function() {
    it("should usually say no", function() {
      hours.isEmpty().should.equal(false);
    });

    it("should say yes if hours has no keys", function() {
      new Hours().isEmpty().should.equal(true);
    });
  });

  describe("#merge", function() {
    var merged;

    beforeEach(function() {
      merged = hours.merge();
    });

    it("should collapse intervals", function() {
      merged.hours.should.eql({
        0: [[900,1800]],
        1: [[900,1700]],
        2: [[900,1800]],
        3: [[900,1800]],
        4: [[900,1800]],
        5: [[900,1800]],
        6: [[900,1730]]
      });

    });
  });
});
