ostb.controller('IndexController', function($rootScope, $location, $state, UsersFactory) {
    $rootScope.showLogin = true;
    $rootScope.checkUser = function() {
      console.log('hit inside controller checkUser');
      UsersFactory.getCurrentUser(function(user) {
        $rootScope.currentUser = user.username || 'public';
          if ($rootScope.currentUser !== 'public') {
            $rootScope.showLogin = false;
            return $rootScope.currentUser;
          } else {
            console.log('hit inside index cont');
            $state.go('dashboard');
          }
        }
      );
    };

    $rootScope.checkUser();

    $rootScope.logoutUser = function(){
      UsersFactory.sessionOut($rootScope.currentUser);
      $rootScope.showLogin = true;
      $rootScope.currentUser = undefined;
      // $state.go('home');
      console.log('hit Dashboard logoutUser');
    }
})

.controller('Login', function($rootScope, $state, $scope, UsersFactory) {
  $rootScope.currentUser = $rootScope.currentUser || undefined;

  $scope.user = {
    username: undefined,
    // email: undefined,
    password: undefined
  };

  $scope.submitTheForm = function(username, password) {
    console.log('hit submitTheForm Login');
    $scope.user.username = username;
    $scope.user.password = password;
    if(password && username){
      var signupInfo = {username: username, password: password};
      var filtered = [];
        _.each(signupInfo, function(value, key){
          if(value.length < 4){
            filtered.push(key);
          }
        });
        console.log('filtered', filtered);
        if(!filtered.length){
          $scope.postUser($scope.user);
        }else{
          $scope.error = filtered.join(', ') + ' needs to be greater than or equal to 4 characters';
        }
    }else if(!username){
      $scope.error = 'check your username';
    }
    else{
      $scope.error = 'check your password';
    }
  };

  $scope.postUser = function(user) {
    UsersFactory.post(user, function(data){
      console.log('inside login controller', data);
      if(data){
        $rootScope.currentUserInfo = data;
        $rootScope.currentUser = data.username;
        console.log('data received after login request', data);
        $rootScope.showLogin = false;
        $state.go('dashboard', {username: data.username});
      }
    })
    .then(function() {
    //should store user info to rootscope currentuser
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  console.log('Login controller');
})

.controller('Dashboard', function($scope, $stateParams, UsersFactory) {

  var profile = document.getElementById('profile');

  UsersFactory.getUser({username: $stateParams.username})
  .then(function(data) {
    $scope.user = data[0];
    var email = $scope.user.email;
    var gravatarHash = CryptoJS.MD5(email).toString();
    profile.src = 'http://www.gravatar.com/avatar/' + gravatarHash + '?s=200';
  })
  .catch(function(err) {
    $scope.error = err;
  });
})

.controller('Signup', function($rootScope, $scope, UsersFactory, $state) {

  $scope.user = {
    username: undefined,
    email: undefined,
    password: undefined
  };

  $scope.submitTheForm = function(username, email, password, passwordVerify) {
    console.log('hit submitTheForm Signup');
    $scope.user.username = username;
    $scope.user.email = email;
    $scope.user.password = password;
    if((username && email && password) && (password === passwordVerify)){
      var signupInfo = {username: username, email: email, password: password};
      var filtered = [];
        _.each(signupInfo, function(value, key){
          if(value.length < 4){
            filtered.push(key);
          }
        });
        if(!filtered.length){
          $scope.createUser($scope.user);
        }else{
          $scope.errorMsg = filtered.join(', ') + ' needs to be greater than or equal to 4 characters';
        }
    }else if(!username){
      $scope.errorMsg = 'check your username';
    }else if(!email){
      $scope.errorMsg = 'check your email';
    }else if(!password || !(password === passwordVerify)){
      $scope.errorMsg = 'check your password';
    }
  };

  $scope.createUser = function(user) {
    UsersFactory.create(user)
    .then(function() {
      $scope.postUser($scope.user);
      // $state.go('dashboard');
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
      $scope.errorMsg = err || 'check your input';
    });
  };

  
  $scope.postUser = function(user) {
    UsersFactory.post(user, function(data){
      console.log('inside login controller', data);
      if(data){
        $rootScope.currentUserInfo = data;
        $rootScope.currentUser = data.username;
        console.log('data received after login request', data);
        $rootScope.showLogin = false;
        $state.go('dashboard');
      }
    })
    .then(function() {
    //should store user info to rootscope currentuser
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };


})

.controller('Account', function($scope, UsersFactory) {
  UsersFactory.getUser({username: $scope.currentUser})
  .then(function(data) {
    $scope.user = data[0];
  })
  .catch(function(err) {
    $scope.error = err;
  });

  $scope.updateUser = function(user) {
    UsersFactory.updateUser(user)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  }
})

.controller('Page', function($scope) {
  console.log('Page');
})

.controller('IndexContent', function($scope){
  $scope.indexContent = 'test';
})

.controller('ContributorsController', function($rootScope, $scope, $stateParams, ProjectsFactory, UsersFactory) {

  var updateMembers = function() {
    ProjectsFactory.getMembers({username: $stateParams.username, repo: $stateParams.repo})
    .then(function(data) {
      $scope.membersList = data;
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.deleteMember = function(member) {
    var project = {
      username: $stateParams.username, 
      repo: $stateParams.repo,
      member: member
    };

    ProjectsFactory.deleteMember(project)
    .then(function() {
      updateMembers();
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.addMember = function(member) {
    
    var project = {
      username: $stateParams.username, 
      repo: $stateParams.repo,
      member: member
    };
    if(_.contains($scope.membersList, member)){
      $scope.response = 'member already in the list';
    }else{

      ProjectsFactory.addMember(project)
      .then(function(data) {
        updateMembers();
      })
      .catch(function(err) {
        $scope.error = err;
      }); 
    }
  };

  $scope.queryUser = [];
  $scope.response = undefined;

  $scope.query = function (user) {
    $scope.response = undefined;
    $scope.queryUser = [];
    UsersFactory.getUser(user, function(returnedUser, response) {
      console.log('returnedUser in controller js getUser', returnedUser);
        var userList = returnedUser;
        userList = _.reject(userList, function(userObj){    
          return _.contains($scope.membersList, userObj.username) || userObj.username === $rootScope.currentUser;
        });
        if (userList.length) {
          $scope.queryUser = userList;
        } else {
          console.log('response', response);
          $scope.response = response || 'No users found';
          console.log('$scope.response', $scope.response);
        }
      
    });
  };

  updateMembers();
})

.controller('EditorController', function($scope, $q, $stateParams, ProjectsFactory) {
  var init = function() {
    var converter = new Showdown.converter({ extensions: ['ostb', 'table'] });
    var view = document.getElementById('view');
    var editor = ace.edit("editor");
    editor.setReadOnly(true);
    editor.session.setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.resize(true);
    
    var connection = new sharejs.Connection('/channel');

    ProjectsFactory.getMembers({username: $stateParams.username, repo: $stateParams.repo})
    .then(function(data) {
      var permissions = data.indexOf($scope.currentUser) !== -1;
      var connectionName = $stateParams.username + '-' + $stateParams.repo;       //unique connection generated
      if(!permissions) {
        connectionName += '-' + $scope.currentUser;
      }

      var dfd = $q.defer();
      connection.open(connectionName, function(err, data) {
        if(err) {
          dfd.reject(err);
        }
        dfd.resolve(data);
      });
      return dfd.promise;
    })
    .then(function(data) {
      doc = data;
      return ProjectsFactory.checkout({username: $stateParams.username, repo: $stateParams.repo})
    })
    .then(function(data) {
      if(doc.getLength() === 0) {
        doc.insert(0, data);
      }

      doc.attach_ace(editor);
      editor.setReadOnly(false);

      var render = function() {
        view.innerHTML = converter.makeHtml(doc.snapshot);
      };

      window.doc = doc;

      render();
      doc.on('change', render);
      
      editor.getSession().on('changeScrollTop',function(scroll){
        var lengthScroll = $('#right')[0].scrollHeight - $('#right').height();
        $('#right').scrollTop(scroll);
      });
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  var doc;
  init();

  $scope.projectName = $stateParams.repo;
})

.controller('DownloadController', function($scope, $stateParams, ProjectsFactory) {
  var converter = new Showdown.converter();
  var render = function(data) {
    return '' +
    '<!DOCTYPE HTML>\n<html>\n<head>\n' + 
    '<link rel="stylesheet" type="text/css" href="css/normalize.css">\n' +
    '<link rel="stylesheet" type="text/css" href="css/default.css">\n</head>\n<body>\n' + 
    converter.makeHtml(data) + '\n</body>\n</html>';
  };

  $scope.getFolder = function() {
    console.log('hit download');

    ProjectsFactory.getFolder({username: $stateParams.username, repo: $stateParams.repo})
    .then(function(data) {
      saveZip(data);
    })
    .catch(function(err) {
      $scope.error = err;
    });
  }

  var saveZip = function(data) {
    var zip = new JSZip();
    zip.file('content.md', data['content.md']);
    zip.file('index.html', render(data['content.md']));
    zip.folder('css').file('normalize.css', data['normalize.css']).file('default.css', data['default.css']);
    try {
      var blob = zip.generate({type:"blob"});
      saveAs(blob, $stateParams.repo + ".zip");
    }catch(e) {
      console.log(e);
    }
    return false;
  }
})


// ----- project CRUD controllers -----

.controller('ProjectsController', function($scope, $state, $stateParams, ProjectsFactory, ModalsFactory) {

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
      $state.go('project', {username: project.username, repo: project.repo});
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.cloneProject = function(project) {

    project.owner = project.username;
    project.username = $scope.currentUser;

    ProjectsFactory.clone(project)
    .then(function() {
      $state.go('project', {username: project.username, repo: project.repo});
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.deleteProject = function(project) {
    ProjectsFactory.delete(project)
    .then(function() {
      $state.go('dashboard', {username: project.username});
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

.controller('DocumentController', function($scope, $state, $stateParams, ProjectsFactory) {
  
  var preview = document.getElementById('preview');
  var converter = new Showdown.converter();
  var md;

  var render = function(data) {
    preview.innerHTML = converter.makeHtml(data);
  };

  var queryObj = {username: $stateParams.username, repo: $stateParams.repo}
  if($stateParams.commitHash) {
    queryObj.commitHash = $stateParams.commitHash;
  }

  ProjectsFactory.checkout(queryObj)
  .then(function(data) {
    md = data;
    render(data);
  })
  .catch(function(err) {
    $scope.error = err;
  });

  $scope.acceptContribution = function() {
    var project = {};
    project.commitBody = {}
    project.commitBody['content.md'] = md;
    project.username = $stateParams.username;
    project.repo = $stateParams.repo;
    project.commitMessage = 'Accepted user contribution';

    ProjectsFactory.commit(project)
    .then(function() {
      $scope.removeContribution();
    })
    .catch(function(err) {
      $scope.error = err;
    });
  }

  $scope.removeContribution = function() {
    var project = {};
    project.username = $stateParams.username;
    project.repo = $stateParams.repo;
    project.commitHash = $stateParams.commitHash;

    ProjectsFactory.removeContribution(project)
    .then(function() {
      console.log('success');
      $state.go('project.versions', {username: project.username, repo: project.repo});
    })
    .catch(function(err) {
      $scope.error = err;
    });
  }
})






