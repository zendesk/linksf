$(function() {
  var geocodeAddress = function(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      callback(status, results ? results[0].geometry : null);
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

  buildFacility = function(json, callbacks) { 
    var fac = new Facility();
    var geo, services;

    if ( !json.address ) 
      return false;

    geo = json.address.replace(/\(.*\)/, '');
    geo = geo + ', San Francisco, CA'

    services = json.services;
    delete json.services;

    fac.set(json);

    geocodeAddress(geo, function(status, point) {
      if (status == google.maps.GeocoderStatus.OK) {
        fac.set('location', new Parse.GeoPoint(point.location.lat(), point.location.lng()));

        fac.save(null, {
          success: function(fac) { 
            buildServices(fac, services);
            callbacks.success(fac);
          }, 
          error: callbacks.error
        });
      } else {
        callbacks.error("Error geocoding address: '" + geo + "'" + " " + status)
      }
    });
  }


//  buildFacility({
//    name:               "A Woman's Place", 
//    addr:               "1049 Howard St (between 6th and 7th)",
//    addr_for_geocoding: "1049 Howard St, San Francisco, CA",
//    description:        "A Place for Women",
//    phone:              "(415) 487-2140",
//    demographics:       ["W"],
//    notes:              "",
//    hours:              {},
//    services: [ 
//      { 
//        name:         "showers",
//        category:     "hygiene", 
//        hours:        {"*": ["8am-4:30pm"]},
//        description:  "",
//        notes:        "Towels are sometimes provided but you may need to bring your own. Soap and Shampoo are provided.",
//        demographics: ["W"]
//      },
//      { 
//        name:         "shelter",
//        category:     "shelter", 
//        hours:        null, // means inherit hours of top level?
//        description:  "5 beds for women in crisis (rape or domestic violence); stay up to 7 days. 16 shelter beds; stay varies. 16 beds in supportive housing (5 for HIV+ women); stay up to 18 months. 8-bed substance abuse program for any woman 18+; stay 1-4 months.",
//        notes:        "Call for interview. Phone line open 24 hours a day.   Drop in 12pm-4pm for referrals & case management.",
//        demographics: ["W"]
//      }
//  ]
//  });
//
});
