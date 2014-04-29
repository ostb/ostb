angular.module('services.users', [])

.factory('UsersFactory', function($http, $q) {

  return {
    create: function(user) {

      console.log('create factory', user)

      var dfd = $q.defer();
      $http.post('/api/users', user)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject();
      });
      return dfd.promise;
    }
  }
});