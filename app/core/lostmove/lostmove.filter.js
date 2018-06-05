angular.
  module('core').
  filter('lostmove', function() {
    return function(data) {
      if(lostonly === false) {
        return false;
      }
      return true;
    };
  });