ostb.controller('IndexController', function($scope) {
})

.controller('Login', function($scope) {
  console.log('Login controller');
})

.controller('Dashboard', function($scope) {
  console.log('Dashboard');
})

.controller('Signup', function($scope, UsersFactory) {
  //2mayAdrian
  $scope.user = {
    username: undefined,
    email: undefined,
    password: undefined
  };

  $scope.submitTheForm = function(username, email, password) {
    console.log('hit submitTheForm');
    $scope.user.username = username;
    $scope.user.email = email;
    $scope.user.password = password;
    $scope.createUser($scope.user);
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
})

.controller('Account', function($scope) {
  console.log('Account');
})

.controller('Dashboard', function($scope) {
  console.log('Dashboard');
})

.controller('Page', function($scope) {
  console.log('Page');
})

.controller('IndexContent', function($scope){
  $scope.indexContent = 'test';
})

.controller('EditorController', function($scope, $stateParams, ProjectsFactory) {
    var init = function() {
    var converter = new Showdown.converter();
    var view = document.getElementById('view');
    var editor = ace.edit("editor");
    editor.setReadOnly(true);
    editor.session.setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.resize(true);
    
    var connection = new sharejs.Connection('/channel');

    var connectionName = $stateParams.username + '-' + $stateParams.repo;       //unique connection generated
    connection.open(connectionName, function(error, doc) {
      if (error) {
        console.error(error);
        return;
      }
      ProjectsFactory.checkout({username: $stateParams.username, repo: $stateParams.repo})
      .then(function(data) {
        if(doc.getLength() === 0) {
          doc.insert(0, data);
        }

        doc.attach_ace(editor);
        editor.setReadOnly(false);
      })
      .catch(function(err) {
        $scope.error = err;
      });

      var render = function() {
        view.innerHTML = converter.makeHtml(doc.snapshot);
      };

      window.doc = doc;

      render();
      doc.on('change', render);

      editor.getSession().on('changeScrollTop',function(scroll){
        var lengthScroll = $('#right')[0].scrollHeight - $('#right').height();
        $('#right').scrollTop(scroll);
        // console.log('editor scroll hit', scroll);
      });
    });
  };
  init();

  $scope.projectName = $stateParams.repo;
})


// ----- project CRUD controllers -----

.controller('VersionsController', function($scope) {})

.controller('ProjectsController', function($scope, $stateParams, ProjectsFactory, ModalsFactory) {

  $scope.modalShown = false;

  $scope.isActive = function() {
    return ModalsFactory.isActive();
  }

  $scope.$watch('isActive()', function() {
    $scope.modalShown = $scope.isActive();
  });

  $scope.toggleModal = function() {
    console.log('toggled')
    ModalsFactory.toggleActive();
  };

  $scope.createProject = function(project) {
    project.username = project.username || $stateParams.username;
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

    project.commitBody = {}
    project.commitBody['content.md'] = window.doc.getText();
    project.username = $stateParams.username;
    project.repo = $stateParams.repo;

    ProjectsFactory.commit(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };
})

.controller('ProjectsListController', function($scope, $stateParams, ProjectsFactory) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  ProjectsFactory.getProjects({username: $stateParams.username})
  .then(function(data) {
    $scope.projects = data;
  })
  .catch(function(err) {
    $scope.error = err;
  });
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

//NOTE!! 'adrian' is hardcoded until auth/users complete! ///////////////////////////////
.controller('ProjectDetailController', function($scope, $state, $stateParams, ProjectsFactory) {

  $scope.isActive = function(link) {
    return $state.$current.includes[link];
  }

  ProjectsFactory.getProjects({username: $stateParams.username, repo: $stateParams.repo})
  .then(function(data) {
    $scope.project = data[0];
  })
  .catch(function(err) {
    $scope.error = err;
  });
})

.controller('DocumentController', function($scope, $stateParams, ProjectsFactory) {
  
  var preview = document.getElementById('preview');
  var converter = new Showdown.converter();

  var render = function(data) {
    preview.innerHTML = converter.makeHtml(data);
  };

  var queryObj = {username: $stateParams.username, repo: $stateParams.repo}
  if($stateParams.commitHash) {
    queryObj.commitHash = $stateParams.commitHash;
  }

  ProjectsFactory.checkout(queryObj)
  .then(function(data) {
    render(data);
  })
  .catch(function(err) {
    $scope.error = err;
  });
})






