(function() {
  'use strict';

  angular
  .module("grockitApp.dashboard")
  .service('dashboard', dashboard)

  dashboard.$inject = ['$q', 'DashboardApi'];

  function dashboard($q, DashboardApi) {
    var dashboardData = null;

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
      return dashboardData.score_prediction;
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
      i = 0,
      subtracks = null,
      smartPractice = null;
      smartPractice = _.forEach(dashboardData.smart_practice, function(result) {
        return subtracks = _.forEach(result[i].items, function(subtrack) {
          accuracy = (subtrack.total_questions_answered_correctly / subtrack.total_questions_answered) * 100;
          subtrack['accuracy'] = accuracy > 0 ? Math.round(accuracy.toFixed(2)) : 0;
        });
        i++;

      });
      return smartPractice;
    }

    this.getChallenge = function() {
      return dashboardData.challenge;
    }

  }

})();
