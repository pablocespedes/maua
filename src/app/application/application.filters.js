(function () {
'use strict';
angular.module("grockitApp.application")
.filter('formatSeconds', formatSeconds)
.filter('truncate', truncate)
.filter('date', date)
.filter('time', time)
.filter('htmlToPlaintext', htmlToPlaintext)
.filter('level', level);

formatSeconds.$inject =['dateFormatter'];
level.$inject=['Level'];

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

function htmlToPlaintext() {
  return function(text) {
    return String(text).replace(/<[^>]+>/gm, '');
  };
}

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

function truncate() {
  return function(text, chars) {
    if (!text) return text;
    var ellipses = '...';
    return text.substr(0, chars) + ellipses;
  };
}
})();
