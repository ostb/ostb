var ostb = angular.module('ostb', [
  'ui.router',
  'factories.users',
  'factories.projects',
  'factories.modals'
])

.config(function($stateProvider) {
  console.log($stateProvider);
  $stateProvider
  .state('home', {
    url: "",
    views: {
      'content': {
        templateUrl: 'partials/splash.html',
        controller: 'Splash'
      }
    }
  })
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
  .state('discover', {
    url: "/discover",
    views: {
      'content': {
        templateUrl: 'partials/discover.html',
        controller: 'DiscoverController'
      }
    }
  })
  .state('account', {
    url: "/:username/account",
    views: {
      'content': {
        templateUrl: 'partials/account.html',
        controller: 'Account'
      }
    }
  })
  .state('dashboard', {
    url: "/:username/dashboard",
    views: {
      'content': {
        templateUrl: 'partials/dashboard.html',
        controller: 'Dashboard'
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
        templateUrl: 'partials/projectDetail.html',
        controller: 'ProjectDetailController'
      }
    }
  })
  .state('project.preview', {
    url: "/preview/:commitHash",
    views: {
      'projectDetail': {
        templateUrl: 'partials/preview.html',
        controller: 'DocumentController'
      }
    }
  })
  .state('project.contribution', {
    url: "/contribution/:commitHash",
    views: {
      'projectDetail': {
        templateUrl: 'partials/contributionPreview.html',
        controller: 'DocumentController'
      }
    }
  })
  .state('project.versions', {
    url: "/versions",
    views: {
      'projectDetail': {
        templateUrl: '/partials/versions.html',
        controller: 'ProjectDetailController'
      }
    }
  })
  .state('project.contributors', {
    url: "/contributors",
    views: {
      'projectDetail': {
        templateUrl: '/partials/contributors.html',
        controller: 'ContributorsController'
      }
    }
  })
  .state('project.statistics', {
    url: "/statistics",
    views: {
      'projectDetail': {
        template: '<h1>project statistics</h1>',
        controller: 'IndexController'
      }
    }
  })

  .state('create-account', {
    url: "/sign-up",
    views: {
      'content': {
        templateUrl: 'partials/sign-up.html',
        controller: 'UsersController'
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


ostb.filter('orderObjectBy',function(){
  return function(items, field, reverse) {
    console.log('field in orderObjectBy', field);
    var filtered = [];
    angular.forEach(items, function(item){
      filtered.push(item);
    });
    filtered.sort(function(a, b){
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse){
      filtered.reverse();
      return filtered;
    }
  };
});
