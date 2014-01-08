var findByFilter = require('cloud/lib/find_by_filter'),
    findById = require('cloud/lib/find_by_id');

Parse.Cloud.define('findByFilter', function(request, response) {
  findByFilter(request.params, response);
});

Parse.Cloud.define('findById', function(request, response) {
  findById(request.params, response);
});
