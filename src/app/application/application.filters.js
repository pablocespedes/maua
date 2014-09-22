(function () {
'use strict';
angular.module("grockitApp.application")
.filter('formatSeconds', formatSeconds)
.filter('level', level);

formatSeconds.$inject =['dateFormatter'];
level.$inject=['Level'];

function formatSeconds(dateFormatter){
 return function(seconds) {
    return dateFormatter.formatSeconds(seconds);
  };
}

function level(Level) {
  return function(input) {
    return Level.getMessage(input);
  };
}
})();
