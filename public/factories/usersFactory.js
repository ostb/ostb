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

    post: function(user, cb){
      var dfd = $q.defer();
      $http.post('/auth/login', user)
      .success(function(data, status, headers, config) {
        cb(data);

        console.log('hit usersFactoryjs post');
        console.log('user', user);

        console.log('data', data);
        console.log('status', status);
        console.log('headers', status);
        console.log('config', config);


        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    getCurrentUser: function(cb){
      var dfd = $q.defer();
      $http.get('/auth/current')
      .success(function(data, status, headers, config) {

        console.log('hit usersFactoryjs getCurrentUser');

        console.log('data', data);
        console.log('status', status);
        console.log('headers', status);
        console.log('config', config);

        cb(data);

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
