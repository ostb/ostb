var ostb = angular.module('ostb', [
  'ui.router',
  'factories.users',
  'factories.projects'
])

.config(function($stateProvider) {
  console.log($stateProvider);
  $stateProvider
  .state('logout', {
    url: "/logout",
    views: {
      'content': {
        template: '<h1>All out of logs!</h1>',
        controller: 'Example'
      }
    }
  })
  .state('example', {
    url: "/example",
    views: {
      'content': {
        template: '<h1>What a good example!</h1>',
        controller: 'Example'
      }
    }
  })
  .state('editor', {
    url: "/editor",
    views: {
      'content': {
        templateUrl: 'partials/editor.html',
        controller: 'Example1'
      }
    }
  })
})

// This is test data.
window.documentsData = {
  pages: {
    1: {
      name: "Mental Disorders of Coal Miners in Pre-Unification East Germany"
    }
  },
  books: {
    1: {
      name: "Mining Coal Miners: Spelunking the Depths of The Coal Miner Psyche",
      pages: {

      }
    }
  }
};
console.log(window.documentsData);

