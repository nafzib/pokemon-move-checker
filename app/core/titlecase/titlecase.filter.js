angular.
  module('core').
  filter('titlecase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\b[\w']+\b/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  })