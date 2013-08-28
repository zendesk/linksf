/*globals describe, it*/

var should = require("should");
describe("Hours", function(){
  var Hours = require('../js/app/models/hours'),
      hours = new Hours({
        Sun: "9AM-6PM",
        Mon: "9AM-12PM,2PM-5PM",
        Tue: "9AM-6PM",
        Wed: "9AM-6PM",
        Thu: "9AM-6PM",
        Fri: "9AM-6PM",
        Sat: "9AM-6PM"
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
        6: [[900,1800]]
      });
    });

    it("should catch bad input", function() {
      (function() { hours.addDay("Mon", ""); }).should.throwError(/Invalid time/);
      (function() { hours.addDay("Mon", "4pm"); }).should.throwError(/Invalid time/);
      (function() { hours.addDay("Mon", "abcd"); }).should.throwError(/Invalid time/);
      (function() { hours.addDay("Mon", "9PM-10PMgarbage"); }).should.throwError(/Invalid time/);

      (function() { hours.addDay("Mon", "9PM-9PM"); }).should.throwError(/Invalid time/);

      (function() { hours.addDay("Mon", "9PM-9AM"); }).should.throwError(/Invalid time/);

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
});
