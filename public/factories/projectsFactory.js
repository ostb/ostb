angular.module('factories.projects', [])

.factory('ProjectsFactory', function($http, $q) {

  return {
    create: function(project) {
      var dfd = $q.defer();
      $http.post('/api/projects', project)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    }
  }
});

