angular.
  module('core').
  filter('hyphenless', function () {
    return function(input) {
      return input.replace(/-/g, '_');
    };
  });