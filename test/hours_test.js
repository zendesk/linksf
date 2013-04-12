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
  });

  describe("#within", function(){
    it("should work", function() {
      hours.within("Sun,10:30AM").should.equal(true);
      hours.within("Mon,10:30AM").should.equal(true);
      hours.within("Mon,12:30PM").should.equal(false);
    });
  })
});
