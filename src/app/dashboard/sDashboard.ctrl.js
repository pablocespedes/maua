(function() {
  'use strict';
  angular
    .module('grockitApp.dashboard')
    .controller('SimpleDashController', SimpleDashController);

  /*Manually injection will avoid any minification or injection problem*/
  SimpleDashController.$inject = ['$window', '$scope', 'dashboard', 'UsersApi', 'utilities', 'Auth', 'currentProduct',
    'membershipService', 'setItUpUserProgress', 'setItUpScorePrediction', 'detectUtils', 'questionTimingService'
  ];

  function SimpleDashController($window, $scope, dashboard, UsersApi, utilities, Auth, currentProduct, membershipService,
    setItUpUserProgress, setItUpScorePrediction, detectUtils, questionTimingService) {
    /* jshint validthis: true */
    var vmDash = this,
      dashObserver = null;
    vmDash.showingTour = false;
    vmDash.loading = true;
    vmDash.isChallengeAvailable = false;
    vmDash.loadingMessage = 'Loading...';
    vmDash.historyVisible = false;
    vmDash.StartPractice = StartPractice;
    //vmDash.startCardinTour = startCardinTour;
    init();

    $scope.$on("$destroy", function() {
      currentProduct.unregisterGroup(dashObserver);
    });

    function init() {

      Auth.getCurrentUserInfo().then(function(userInfo) {
        if (userInfo !== null) {
          vmDash.user_id = userInfo.userId;

          dashObserver = currentProduct.observeGroupId().register(function(groupId) {
            if (vmDash.activeGroupId !== groupId) {
              vmDash.activeGroupId = groupId;
              SimpleDashBoard.getDashboard(vmDash.activeGroupId);
              vmDash.showBuyNow = membershipService.showBuyButton();
              vmDash.upgradePromptMessage = membershipService.upgradePromptMessage();
              vmDash.canPractice = membershipService.canPractice();
              vmDash.enableScore = (vmDash.activeGroupId === 'gmat' || vmDash.activeGroupId === 'act' || vmDash.activeGroupId === 'sat');
              vmDash.historyVisible = false;
              var baseUrl = utilities.originalGrockit(false).url;
              vmDash.paymentPage = baseUrl + '/' + vmDash.activeGroupId + '/subscriptions/new';
            }
          });
        }
      });
    };

    function StartPractice(subject, trackId) {

      if (vmDash.canPractice) {
        if (angular.isDefined(subject)) {
          if (vmDash.activeGroupId === 'gre') {
            utilities.setActiveTrack(subject, trackId);
            utilities.internalRedirect('/' + vmDash.activeGroupId + '/custom-practice/');
          } else {
            var url = '/' + vmDash.activeGroupId + '/' + trackId + '/play';
            utilities.redirect(url);
          }

        }
      }
    };



    var SimpleDashBoard = {
      getDashboard: function(groupId) {

        dashboard.setDashboardData(groupId).then(function(result) {
          var hasQuestionsAnswered = dashboard.hasQuestionsAnswered();
          if (!hasQuestionsAnswered && vmDash.activeGroupId !== 'gre' && !detectUtils.isMobile()) vmDash.showTour = true;
          else vmDash.showTour = false;

          if (!hasQuestionsAnswered && vmDash.activeGroupId === 'gre') {
            var base = utilities.newGrockit().url;
            $window.location.href = base + '/#/' + vmDash.activeGroupId + '/custom-practice/';
          } else {

            if (vmDash.enableScore)
              SimpleDashBoard.fetchScorePrediction();

            SimpleDashBoard.fetchTracks();
            SimpleDashBoard.getHistoryInformation();
            SimpleDashBoard.getChallenge();
          }


        });
      },
      fetchTracks: function() {
        vmDash.loading = true;
        var smartPractice = dashboard.getSmartPractice();
        vmDash.tracks = smartPractice.items;
        vmDash.loading = false;
      },
      fetchScorePrediction: function() {
        var scoreResponse = dashboard.getScorePrediction();
        if (angular.isDefined(scoreResponse)) {
          setItUpScorePrediction.setScorePrediction(scoreResponse);
          vmDash.score = scoreResponse;
        }
      },
      getHistoryInformation: function() {
        var historyResponse = dashboard.getProgress();
        if (angular.isDefined(historyResponse)) {
          membershipService.membershipValidation(vmDash.activeGroupId, historyResponse.all);
        }
        setItUpUserProgress.setUserProgress(historyResponse);
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
