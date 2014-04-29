angular.module('services.users', [])

.factory('ProjectsFactory', function($http, $q) {

  return {
    create: function(project) {
      var dfd = $q.defer();
      $http.post('localhost:3000' + '/api/users', project)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject();
      });
      return dfd.promise;
    }
});