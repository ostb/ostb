angular.module('ostb', [
  'ui.router'
])

.config( function($stateProvider) {
  console.log($stateProvider);
  $stateProvider
  .state('example', {
    url: "/example",
    views: {
      'content': {
        template: '<h1>Hey look at this content!</h1>',
        controller: 'Example'
      }
    }
  })

  .state('documents', {
    url: "/documents",
    views: {
      'content': {
        template: '../views/documents.ejs',
        controller: 'Example'
      }
    }
  })

  .state('/', {
    url: "/",
    views: {
      'content': {
        templateURL: '<h1>Hey look at this content!</h1>',
        controller: 'Example'
      }
    }
  })

})

.controller('Example', function($scope) {
  console.log('Example controller');
})

// .run(function($rootScope, $state, $stateParams) {
//   console.log('Run');

//   $rootScope.$state = $state;
//   $rootScope.$stateParams = $stateParams;

// })