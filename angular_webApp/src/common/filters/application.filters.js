angular.module('grockitApp.filters', [])
.filter('formatSeconds', ['DateFormatter', function(DateFormatter) {
  return function(seconds) {
    return DateFormatter.formatSeconds(seconds);
  };
}])
.filter('level', function(Level) {
  return function(input) {
    return Level.getMessage(input);
  };
});
