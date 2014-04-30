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

.controller('VersionsController', function($scope, ProjectsFactory) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.getVersions = function(project) {
    ProjectsFactory.getVersions(project)
    .then(function(data) {
      $scope.versions = data;
      console.log($scope.versions);
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };
})

.controller('Example', function($scope) {
  console.log('Example controller');
})

.controller('ProjectsController', function($scope, ProjectsFactory) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.createProject = function(project) {
    ProjectsFactory.create(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.cloneProject = function(project) {
    ProjectsFactory.clone(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.deleteProject = function(project) {
    ProjectsFactory.delete(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.commitProject = function(project) {
    var temp = project.commitBody;
    project.commitBody = {}
    project.commitBody['content.md'] = temp;

    ProjectsFactory.commit(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };
})

.controller('UsersController', function($scope, UsersFactory) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.createUser = function(user) {
    UsersFactory.create(user)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.deleteUser = function(user) {
    UsersFactory.delete(user)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };
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

