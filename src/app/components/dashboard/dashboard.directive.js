angular.module("grockitApp.components")

.directive('scorePrediction', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/dashboard/templates/scorePrediction.tpl.html',
    scope: {
      groupTitle: '=',
      totalScore: '=',
      rangeInit: '=',
      rangeEnd: '=',
      isVisible: '=',
      noScoreMessage: '@'
    },
    link: function (scope, element, attrs) {
      scope.hasScore = function () {
        return (scope.totalScore !== null && scope.totalScore > 0);
      };
    }
  };
})

.directive('trackList', function(utilities) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/dashboard/templates/track-list.tpl.html',
    scope: {
      tracks: '=',
      startPractice: '=',
      getScore: '=',
      isVisible: '='
    },
    link: function (scope, element, attrs) {

      scope.hasScore = function (track) {
        return (scope.getScore(track) !== null && scope.getScore(track) > 0);
      };

      scope.getYourScorePredictionUrl = function(track){
        var baseUrl=utilities.originalGrockit(false).url;
        utilities.redirect(baseUrl+'/assessment/for_track/'+track.id);
      }
    }

  };
})

.directive('historyChart', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/dashboard/templates/dashboard-history.tpl.html',
    scope: {
      historyInfo: '='
    }
  };
})

.directive('challengeDashboard', function(utilities) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/dashboard/templates/dashboard-challenge.tpl.html',
    scope: {
      challenges: '='
    },
    link: function(scope){
      scope.newChallenge = function (index) {
        var currentChallenge = scope.challenges[index];
        scope.challengeId=currentChallenge.id;
        var baseUrl = utilities.originalGrockit().url;
        utilities.redirect(baseUrl+'/assessment/introcards/'+scope.challengeId);

      };

    }
  };
});

