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

.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
})

.controller('MyCtrl', ['$scope', function($scope) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
}]);



// })

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

