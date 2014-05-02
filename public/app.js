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
    url: "/dashboard",
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
  .state('project', {
    url: "/:projectId",
    views: {
      'content': {
        templateUrl: 'partials/versions.html',
        controller: 'Example'
      }
    }
  })
  .state('project', {
    url: "/:projectId",
    views: {
      'content': {
        templateUrl: 'partials/versions.html',
        controller: 'Example'
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

