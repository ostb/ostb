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
  .state('sign-up', {
    url: "/sign-up",
    views: {
      'content': {
        templateUrl: 'partials/sign-up.html',
        controller: 'Signup'
      }
    }
  })
  .state('dashboard', {
    url: "/dashboard/:username",
    views: {
      'content': {
        templateUrl: 'partials/dashboard.html',
        controller: 'Dashboard'
      }
    }
  })
  .state('page', {
    url: "/page",
    views: {
      'content': {
        templateUrl: 'partials/page.html',
        controller: 'Page'
      }
    }
  })
  .state('editor', {
    url: "/editor/:username/:repo",
    views: {
      'content': {
        templateUrl: 'partials/editor.html',
        controller: 'EditorController'
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
  .state('project', {
    url: "/:username/:repo",
    views: {
      'content': {
        templateUrl: 'partials/page.html',
        controller: 'ProjectDetailController'
      }
    }
  })
  .state('project.document', {
    url: "/document",
    views: {
      'projectDetail': {
        template: '<h1>project document</h1>',
        controller: 'Example'
      }
    }
  })
  .state('project.versions', {
    url: "/versions",
    views: {
      'projectDetail': {
        templateUrl: '/partials/versions.html',
        controller: 'VersionsController'
      }
    }
  })
  .state('project.contributions', {
    url: "/contributions",
    views: {
      'projectDetail': {
        template: '<h1>project contributions</h1>',
        controller: 'Example'
      }
    }
  })
  .state('project.statistics', {
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

