
angular.module('angularApp', [])

  .run(function($rootScope, postSomething) {
    console.log('inside app js hit');
    
    $rootScope.goPost = function(){
      postSomething.post('/ostb', null, function(data) {      
        console.log('hit');
      });
    };

  })
  .factory('postSomething', ['$http', function($http) {
    return  {
      post: function(url, data, cb) {
        var postData = $http.post(url, data);
        postData.success(function(data) {
          cb(data);
        });
        postData.error(function(error) {
          console.log(error);
        });
      },
    };
}]);

  
