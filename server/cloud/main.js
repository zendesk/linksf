var findByFilter = require('cloud/lib/find_by_filter'),
    findById = require('cloud/lib/find_by_id'),
    feedback = require('cloud/lib/feedback');

Parse.Cloud.define('findByFilter', function(request, response) {
  findByFilter(request.params, response);
});

Parse.Cloud.define('findById', function(request, response) {
  findById(request.params, response);
});

Parse.Cloud.define('sendFeedback', function(request, response) {
  feedback(request.params, response);
});
