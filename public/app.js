var ostb = angular.module('ostb', [
  'ui.router',
  'factories.users',
  'factories.projects'
])

.config(function($stateProvider) {
  console.log($stateProvider);
  $stateProvider
  .state('login', {
    url: "/login",
    views: {
      'content': {
        templateUrl: 'partials/login.html',
        controller: 'Login'
      }
    }
  })
  .state('logout', {
    url: "/logout",
    views: {
      'content': {
        template: '<h1>All out of logs!</h1>',
        controller: 'Example'
      }
    }
  })
  .state('dashboard', {
    url: "/user_id/:username",
    views: {
      'content': {
        templateUrl: 'partials/dashboard.html',
        controller: 'Dashboard'
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
  .state('versions', {
    url: "/versions",
    views: {
      'content': {
        templateUrl: 'partials/versions.html',
        controller: 'Example'
      }
    }
  })
  .state('projectCrud', {
    url: "/projectCrud",
    views: {
      'content': {
        templateUrl: 'partials/projectCrudTest.html',
        controller: 'Example'
      }
    }
  })
  .state('project', {     //user.project after auth implemented
    url: "/project_id/:projectId",
    views: {
      'content': {
        templateUrl: 'partials/page.html',
        controller: 'ProjectDetailController'
      }
    }
  })
  .state('project.document', {     //user.project after auth implemented
    url: "/document",
    views: {
      'projectDetail': {
        template: '<h1>project document</h1>',
        controller: 'Example'
      }
    }
  })
  .state('project.versions', {     //user.project after auth implemented
    url: "/versions",
    views: {
      'projectDetail': {
        templateUrl: '/partials/versions.html',
        controller: 'VersionsController'
      }
    }
  })
  .state('project.contributions', {     //user.project after auth implemented
    url: "/contributions",
    views: {
      'projectDetail': {
        template: '<h1>project contributions</h1>',
        controller: 'Example'
      }
    }
  })
  .state('project.statistics', {     //user.project after auth implemented
    url: "/statistics",
    views: {
      'projectDetail': {
        template: '<h1>project statistics</h1>',
        controller: 'Example'
      }
    }
  })
});
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

