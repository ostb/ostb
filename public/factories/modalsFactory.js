angular.module('factories.modals', [])

.factory('ModalsFactory', function($http, $q) {

  var active = false;

  return {
    isActive: function() {
      return active;
    },

    toggleActive: function() {
      active = !active;
    }
  }
});

