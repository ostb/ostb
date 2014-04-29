angular.module('app.services.project', [])

.factory('ProjectFactory', function($http, $q) {

  return {
    query: function(type) {
      var dfd = $q.defer();
      return dfd.promise;
    }
});
