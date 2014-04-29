ostb.controller('IndexController', function($scope) {
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

.controller('VersionsController', function($scope) {
  console.log('Versions controller');

  $scope.versions = {
    a: {
      commitMsg: 'foo'
    },
    b: {
      commitMsg: 'bar'
    }
  }
})

.controller('Example', function($scope) {
  console.log('Example controller');
})

.controller('IndexContent', function($scope){
  $scope.indexContent = 'test';
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
});

