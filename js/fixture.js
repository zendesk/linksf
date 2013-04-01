$(function() {
  var geocodeAddress = function(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        callback(results[0].geometry);
      } else {
        return null;
      }
    });
  }
  var buildServices = function(fac, services) {
    var i;
    for (i=0; i < services.length; i++) { 
      var service = new Service();
      service.set("facility", fac);
      service.set(services[i]);
      service.save();
    }
  }

  var buildFacility = function(json) { 
    var fac = new Facility();
    var geo, services;

    geo = json.addr_for_geocoding;
    geo = geo || json.addr;
    delete json['addr_for_geocoding'];

    services = json.services;
    delete json.services;

    fac.set(json);

    geocodeAddress(geo, function(point) {
      fac.geo = new Parse.GeoPoint(point.location.lat(), point.location.lng());
      fac.save();
      buildServices(fac, services);
    });
  }


  buildFacility({
    name:               "A Woman's Place", 
    addr:               "1049 Howard St (between 6th and 7th)",
    addr_for_geocoding: "1049 Howard St, San Francisco, CA",
    description:        "A Place for Women",
    phone:              "(415) 487-2140",
    demographics:       ["W"],
    notes:              "",
    hours:              {},
    services: [ 
      { 
        name:         "showers",
        category:     "hygiene", 
        hours:        {"*": ["8am-4:30pm"]},
        description:  "",
        notes:        "Towels are sometimes provided but you may need to bring your own. Soap and Shampoo are provided.",
        demographics: ["W"]
      },
      { 
        name:         "shelter",
        category:     "shelter", 
        hours:        null, // means inherit hours of top level?
        description:  "5 beds for women in crisis (rape or domestic violence); stay up to 7 days. 16 shelter beds; stay varies. 16 beds in supportive housing (5 for HIV+ women); stay up to 18 months. 8-bed substance abuse program for any woman 18+; stay 1-4 months.",
        notes:        "Call for interview. Phone line open 24 hours a day.   Drop in 12pm-4pm for referrals & case management.",
        demographics: ["W"]
      }
  ]
  });
});
