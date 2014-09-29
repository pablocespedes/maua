(function () {
'use strict';
angular.module("grockitApp.application")
.filter('formatSeconds', formatSeconds)
.filter('truncate', truncate)
.filter('date', date)
.filter('time', time)
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

function time() {
  return function(date) {
    if (date) {
      var parsedDate = new Date(date);
      console.log(date);
      var hours = parsedDate.getHours(),
          minutes = parsedDate.getMinutes(),
          seconds = parsedDate.getSeconds(),
          period = hours > 12 ? 'pm' : 'am';
      hours = hours > 12 ? hours - 12 : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      return hours + ':' + minutes + ':' + seconds + ' ' + period;
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
  var tracks = [
        {id: "1", short_name: "English"},
        {id: "2", short_name: "Science"},
        {id: "3", short_name: "Math"},
        {id: "4", short_name: "Reading"},
        {id: "8", short_name: "Verbal"},
        {id: "9", short_name: "Quantitative"}
      ];

  return function(trackId, groupId) {
    var track = _.find(tracks, {id: trackId});
    return track.short_name;
  };
}

function level(Level) {
  return function(input) {
    return Level.getMessage(input);
  };
}

function truncate() {
  return function(text, chars) {
    if (!text) return text;
    var ellipses = '...';
    return text.substr(0, chars) + ellipses;
  };
}
})();
