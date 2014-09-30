(function() {
  'use strict';
  angular
  .module('grockitApp.dashboard')
  .controller('SimpleDashController', SimpleDashController);

  /*Manually injection will avoid any minification or injection problem*/
  SimpleDashController.$inject = ['$scope', 'dashboard', 'UsersApi', 'utilities', 'Auth', 'alerts', 'currentProduct'];

  function SimpleDashController($scope, dashboard, UsersApi, utilities, Auth, alerts, currentProduct) {
    /* jshint validthis: true */
    var vmDash = this,
    dashObserver = null;

    vmDash.loading = true;
    vmDash.isChallengeAvailable = false;
    vmDash.scoreLoading = true;
    vmDash.loadingMessage = 'Loading...';
    vmDash.historyVisible = false;
    utilities.setActiveTab(0);
    vmDash.getScore = getScore;
    vmDash.StartPractice = StartPractice;

    init();


    $scope.$on("$destroy", function() {
      currentProduct.unregisterGroup(dashObserver);
    });

    function init() {

      Auth.getCurrentUserInfo().then(function(userInfo) {
        if (userInfo !== null) {
          vmDash.user_id = userInfo.userId;

          dashObserver = currentProduct.observeGroupId().register(function(groupId) {
            vmDash.activeGroupId = groupId;
            vmDash.enableScore = (vmDash.activeGroupId === 'gmat' || vmDash.activeGroupId === 'act' || vmDash.activeGroupId === 'sat');
            SimpleDashBoard.getDashboard(vmDash.activeGroupId);
            vmDash.historyVisible = false;
          });
        }
      });
    };

    function getScore(track) {
      return (vmDash.score) ? vmDash.score.tracks[track.id] : null;
    };


    function StartPractice(subject,trackId) {
           utilities.setActiveTab(0);
      if (angular.isDefined(subject)) {
        console.log(trackId)
        utilities.setActiveTrack(subject,trackId);
        utilities.internalRedirect('/' + vmDash.activeGroupId + '/custom-practice/');
      } else {
        alerts.showAlert('You must select one track at least', 'warning');
      }
    };

    var SimpleDashBoard = {
      getDashboard: function(groupId) {
        dashboard.setDashboardData(groupId).then(function(result) {
          if (vmDash.enableScore)
            SimpleDashBoard.fetchScorePrediction();

          SimpleDashBoard.fetchTracks();
          SimpleDashBoard.getHistoryInformation();
          SimpleDashBoard.getChallenge()
        });
      },
      fetchTracks: function() {
        vmDash.loading = true;
        var smartPractice = dashboard.getSmartPractice();
        vmDash.tracks = smartPractice.items;
        vmDash.loading = false;
      },
      fetchScorePrediction: function() {
        var scoreResponse = dashboard.getScorePrediction(),
        scoreData = {};
        vmDash.score = scoreResponse;
        if (scoreResponse.total_score != null && scoreResponse.range != null) {

          scoreData.totalScore = scoreResponse.total_score;
          scoreData.rangeInit = scoreResponse.range[0];
          scoreData.rangeEnd = scoreResponse.range[1];

        } else {
          scoreData.totalScore = 0;
          scoreData.rangeInit = 0;
          scoreData.rangeEnd = 0;
        }
        vmDash.scoreLoading = false;
        vmDash.scoreData = scoreData;
      },
      getHistoryInformation: function() {
        vmDash.loading = true;
        var historyResponse = dashboard.getProgress();
        if (angular.isDefined(historyResponse)) {
          vmDash.historyVisible = true;
          vmDash.historyInfo = {};
          vmDash.historyInfo.totalQuestLastW = historyResponse.lastWeek
          vmDash.historyInfo.totalQuest = historyResponse.all;
          vmDash.historyInfo.totalQuestToday = historyResponse.today;
          vmDash.loading = false;
        } else {
          vmDash.historyVisible = false;
        }
      },
      getChallenge: function() {
        var challenge = dashboard.getChallenge();
        if (!_.isEmpty(challenge)) {
          vmDash.isChallengeAvailable = true;
          vmDash.challengesGames = challenge.items;

        }
      }
    };
  }

})();
