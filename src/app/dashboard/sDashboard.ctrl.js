(function() {
  'use strict';
  angular
  .module('grockitApp.dashboard')
  .controller('SimpleDashController', SimpleDashController);

  /*Manually injection will avoid any minification or injection problem*/
  SimpleDashController.$inject = ['$scope', 'dashboard', 'UsersApi', 'utilities', 'Auth', 'alerts', 'currentProduct', 'membershipService'];

  function SimpleDashController($scope, dashboard, UsersApi, utilities, Auth, alerts, currentProduct, membershipService) {
    /* jshint validthis: true */
    var vmDash = this,
    dashObserver = null;

    vmDash.loading = true;
    vmDash.isChallengeAvailable = false;
    vmDash.scoreLoading = true;
    vmDash.loadingMessage = 'Loading...';
    vmDash.historyVisible = false;
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

            vmDash.canPractice = membershipService.canPractice();

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


    function StartPractice(subject, trackId) {

      if (vmDash.canPractice) {
        if (angular.isDefined(subject)) {
          utilities.setActiveTrack(subject, trackId);
          utilities.internalRedirect('/' + vmDash.activeGroupId + '/custom-practice/');
        } else {
          alerts.showAlert('You must select one track at least', 'warning');
        }

        /*if (angular.isDefined(subject)) {
          if (vmDash.activeGroupId === 'gre') {
            utilities.setActiveTrack(subject, trackId);
            utilities.internalRedirect('/' + vmDash.activeGroupId + '/custom-practice/');
          } else {
            var url = '/' + vmDash.activeGroupId + '/' + trackId + '/play';
            utilities.redirect(url);
          }

        } else {
          alerts.showAlert('You must select one track at least', 'warning');
        }*/
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
        var scoreResponse = dashboard.getScorePrediction()

        if (angular.isDefined(scoreResponse)) {
          vmDash.score = scoreResponse;
        }
        vmDash.scoreLoading = false;
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
          membershipService.membershipValidation(vmDash.activeGroupId ,historyResponse.all);
        } else {
          vmDash.historyVisible = false;
        }
      },
      getChallenge: function() {
        var challenge = dashboard.getChallenge();
        if (!_.isEmpty(challenge) && challenge.items.length > 0) {
          vmDash.isChallengeAvailable = true;
          vmDash.challengesGames = challenge.items;

        }
      }
    };
  }

})();
