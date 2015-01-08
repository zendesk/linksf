var Facility = require('cloud/models/facility');

module.exports = function (params, callbacks) {
  var q = new Parse.Query(Facility);

  q.include('services');
  q.get(params.id, {
    success: function(result) {
      callbacks.success(result);
    },
    error: function(err) {
      callbacks.error(err);
    }
  });
};
