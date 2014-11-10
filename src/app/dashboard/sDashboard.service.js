(function() {
  'use strict';

  angular
  .module("grockitApp.dashboard")
  .service('dashboard', dashboard)

  dashboard.$inject = ['$q', 'DashboardApi'];

  function dashboard($q, DashboardApi) {
    var dashboardData = null,
    _dashboarFn={
     getScore: function(track) {
      return (dashboardData.score_prediction) ? dashboardData.score_prediction.tracks[track.id] : null;
     }
    };

    this.setDashboardData = function(groupId) {
      var deferred = $q.defer();
        DashboardApi.getDashboard(groupId).then(function(result) {
          dashboardData = null;
          dashboardData = result.data.dashboard
          deferred.resolve(true);

        });

      return deferred.promise;
    }

    this.getScorePrediction = function() {
      var scoreResponse = dashboardData.score_prediction,
      scoreData = {};
      scoreData.tracks = scoreResponse.tracks;
      scoreData.totalScore = scoreResponse.total_score !== null ? scoreResponse.total_score : 0;
      scoreData.incomplete = scoreResponse.incomplete;

      if (scoreResponse.range !== null && !_.isEmpty(scoreResponse.range)) {
        scoreData.rangeExist = true;
        scoreData.rangeInit = scoreResponse.range[0];
        scoreData.rangeEnd = scoreResponse.range[1];
      } else {
        scoreData.rangeExist = false;
      }
      return scoreData;
    };

    this.getProgress = function() {
      var history = {};

      history.today = angular.isDefined(dashboardData.progress.today) ? dashboardData.progress.today.total_questions_answered : 0;

      history.lastWeek = angular.isDefined(dashboardData.progress.last_week) ? dashboardData.progress.last_week.total_questions_answered : 0;

      history.all = angular.isDefined(dashboardData.progress.all) ? dashboardData.progress.all.total_questions_answered : 0;

      return history;
    }

    this.getSmartPractice = function() {
      var accuracy = null,
      subtracks = null,
      smartPracticeItems = null;
      smartPracticeItems = _.forEach(dashboardData.smart_practice.items, function(result) {

        result['getScore']= _dashboarFn.getScore(result);
        result['hasScore'] = (_dashboarFn.getScore(result) !== null && _dashboarFn.getScore(result) > 0);
        return subtracks = _.forEach(result.items, function(subtrack) {
          accuracy = (subtrack.total_questions_answered_correctly / subtrack.total_questions_answered) * 100;
          subtrack['accuracy'] = accuracy > 0 ? Math.round(accuracy.toFixed(2)) : 0;
        });

      });
      dashboardData.smart_practice.items = smartPracticeItems

      return dashboardData.smart_practice;
    }

    this.getChallenge = function() {
      return dashboardData.challenge;
    }


    this.hasQuestionsAnswered = function(){
     return  (dashboardData.progress.all.total_questions_answered >= 1);
    }

  }

})();
