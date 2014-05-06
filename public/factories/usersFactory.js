angular.module('factories.users', [])

.factory('UsersFactory', function($http, $q) {

  return {

    create: function(user) {
      var dfd = $q.defer();
      $http.post('/auth/signup', user)
      .success(function(data, status, headers, config) {        
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    post: function(user){
      var dfd = $q.defer();
      $http.post('/auth/login', user)
      .success(function(data, status, headers, config) {


        console.log('hit usersFactoryjs post');
        console.log('user', user);


        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    delete: function(user) {
      var dfd = $q.defer();
      $http.delete('/api/users?username=' + user.username)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject(data);
      });
      return dfd.promise;
    }
  }
});
