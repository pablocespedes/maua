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
        console.log(dashboardData)
        deferred.resolve(true);

      });

      return deferred.promise;
    }

    this.getScorePrediction = function() {
      return dashboardData.score_prediction;
    };
    this.getProgress = function() {
      var history = {},allQuestions,todayQuestions;

      todayQuestions= _.pluck(dashboardData.progress.today, 'total_questions');
      history.today = todayQuestions.length>0 ? _.reduce(todayQuestions, function(num,sum){ return num+sum}) : 0;

      allQuestions= _.pluck(dashboardData.progress.all, 'total_questions');
      history.all = allQuestions.length>0 ? _.reduce(allQuestions, function(num,sum){ return num+sum}) : 0;


      return history;
    }
    this.getSmartPractice = function() {
      return dashboardData.sections[0].smart_practice;
    }
    this.getChallenge = function() {
      return dashboardData.sections[1].challenge;
    }

  }

})();
