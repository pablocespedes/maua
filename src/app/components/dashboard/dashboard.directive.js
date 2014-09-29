(function() {
  'use strict';
  angular
  .module("grockitApp.components")
  .directive('scorePrediction', scorePrediction)
  .directive('trackList', trackList)
  .directive('historyChart', historyChart)
  .directive('challengeDashboard', challengeDashboard)

  function scorePrediction() {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/scorePrediction.tpl.html',
      restrict: 'A',
      scope: {
        groupTitle: '=',
        totalScore: '=',
        rangeInit: '=',
        rangeEnd: '=',
        isVisible: '=',
        noScoreMessage: '@'
      }

    };
    return directive;

    function link(scope, element, attrs) {
      scope.hasScore = function() {
        return (scope.totalScore !== null && scope.totalScore > 0);
      };
    }
  }

  function trackList() {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/track-list.tpl.html',
      restrict: 'A',
      scope: {
        tracks: '=',
        startPractice: '=',
        getScore: '=',
        isVisible: '='
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

  function historyChart() {
    var directive = {
      templateUrl: 'app/components/dashboard/templates/dashboard-history.tpl.html',
      restrict: 'A',
      scope: {
        historyInfo: '='
      }
    };
    return directive;
  }

  function challengeDashboard() {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/dashboard-challenge.tpl.html',
      restrict: 'A',
      scope: {
        challenges: '='
      },
    };
    return directive;

    function link(scope, element, attrs) {
      scope.newChallenge = function(index) {
        var currentChallenge = scope.challenges[index]
        pieces = currentChallenge.url.split("/"),
        id = pieces[pieces.length - 1],
        baseUrl = utilities.originalGrockit().url;

        scope.challengeId = id;
        utilities.redirect(baseUrl + '/assessment/introcards/' + scope.challengeId);

      };
    }
  }
})();

