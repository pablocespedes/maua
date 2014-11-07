(function() {
  'use strict';
  angular
  .module("grockitApp.components")
  .directive('trackList', trackList)
  .directive('challengeDashboard', challengeDashboard)
  .directive('doNow', doNow);

  trackList.$inject = ['utilities'];
  challengeDashboard.$inject = ['utilities'];


  function trackList(utilities) {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/track-list.tpl.html',
      restrict: 'A',
      scope: {
        tracks: '=',
        startPractice: '=',
        getScore: '=',
        isVisible: '=',
        canPractice: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {

      scope.empty = function(track) {
        return angular.isDefined(track.items) && track.items.length > 0 ? true : false;
      }

      scope.hasScore = function(track) {
        return (scope.getScore(track) !== null && scope.getScore(track) > 0);
      };

      scope.getYourScorePredictionUrl = function(track) {
        var baseUrl = utilities.originalGrockit(false).url;
        utilities.redirect(baseUrl + '/assessment/for_track/' + track.id);
      }
    }
  }

  function challengeDashboard(utilities) {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/dashboard-challenge.tpl.html',
      restrict: 'A',
      scope: {
        challenges: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
      scope.newChallenge = function(index) {
        var currentChallenge = scope.challenges[index],
        pieces = currentChallenge.url.split("/"),
        id = pieces[pieces.length - 1],
        baseUrl = utilities.originalGrockit().url;

        scope.challengeId = id;
        utilities.redirect(baseUrl + '/assessment/introcards/' + scope.challengeId);

      };
    }
  }

  function doNow() {
    var directive = {
      templateUrl: 'app/components/dashboard/templates/do-now.tpl.html',
      restrict: 'A',
      scope:false
    };
    return directive;
  }
})();
