(function () {
'use strict';
angular.module("grockitApp.application")
.filter('formatSeconds', formatSeconds)
.filter('truncate', truncate)
.filter('date', date)
.filter('track', track)
.filter('level', level);

formatSeconds.$inject =['dateFormatter'];
level.$inject=['Level'];
track.$inject=['TracksApi'];

function date() {
  return function(date) {
    if (date) {
      var parsedDate = new Date(date);
      return parsedDate.getDate() + '/' + (parsedDate.getMonth() + 1) + '/' + parsedDate.getFullYear();
    }
    return date;
  };
}

function formatSeconds(dateFormatter){
 return function(seconds) {
    return dateFormatter.formatSeconds(seconds);
  };
}

function track(TracksApi) {
  return function(trackId, groupId) {
    var allByGroup = TracksApi.allByGroup(_.parseInt(groupId), false);
    console.log(allByGroup);
    return _.find(allByGroup, {trackId: trackId});
  }
}

function level(Level) {
  return function(input) {
    return Level.getMessage(input);
  };
}

function truncate() {
  return function(text, chars) {
    var ellipses = '...';
    return text.substr(0, chars) + ellipses;
  };
}
})();
