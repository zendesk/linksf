var Facility = require('cloud/models/facility');

var findByFilter = function(params) {
  var deferred = $.Deferred();

  Parse.Cloud.run('findByFilter', params, {
    success: function(result) {
      deferred.resolve({
        data: result.slice(1),
        offset: result[0]
      });
    },

    error: function(err) {
      deferred.reject(err);
    }
  });

  return deferred.promise();
};

var findById = function(id) {
  var deferred = $.Deferred();

  Parse.Cloud.run('findById', {id: id}, {
    success: function(result) {
      deferred.resolve(result);
    },

    error: function(err) {
      deferred.reject(err);
    }
  });

  return deferred.promise();
};

module.exports = {
  findByFilter: findByFilter,
  findById: findById
};
