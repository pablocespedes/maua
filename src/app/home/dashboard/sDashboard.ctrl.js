(function() {
  'use strict';
  angular
  .module('grockitApp.home')
  .controller('SimpleDashController', SimpleDashController);

  /*Manually injection will avoid any minification or injection problem*/
  SimpleDashController.$inject = ['Users', 'history', 'Tracks', 'utilities', 'Auth', 'alerts', 'Challenge',
  'Groups', 'setCurrentProduct'];

  function SimpleDashController(Users, history, Tracks, utilities, Auth, alerts, Challenge, Groups, setCurrentProduct) {
    /* jshint validthis: true */
    var vmDash = this;

    vmDash.loading = true;
    vmDash.isChallengeAvailable = false;
    vmDash.scoreLoading = true;
    vmDash.loadingMessage = 'Loading...';
    vmDash.historyVisible = false;
    utilities.setActiveTab(0);
    vmDash.getScore = getScore;
    vmDash.customPractice = customPractice;
    vmDash.StartPractice = StartPractice;
    vmDash.init = init;

    function getScore(track) {
      return (vmDash.score) ? vmDash.score.tracks[track.id] : null;
    };

    function customPractice() {
      var baseUrl = utilities.originalGrockit().url;
      utilities.redirect(baseUrl + '/' + vmDash.activeGroupId + '/custom_games/new');
    }

    function StartPractice(index) {
      if (angular.isDefined(index)) {

        var tracks = [],
        trackTitle = vmDash.tracks[index].name;
        tracks.push(vmDash.tracks[index].id);

        var trackData = {
          tracks: tracks,
          trackTitle: trackTitle
        };
        utilities.setActiveTab(0);
        utilities.setActiveTrack(trackData);
        utilities.internalRedirect('/' + vmDash.activeGroupId + '/custom-practice/');
      } else {
        alerts.showAlert('You must select one track at least', 'warning');
      }
    };

    function init() {
      Auth.getCurrentUserInfo().then(function(userInfo) {
        vmDash.user_id = userInfo.userId;

        vmDash.activeGroupId = userInfo.currentGroup;
        setCurrentProduct.currentGroupId(vmDash.activeGroupId);

        Groups.getGroups().membershipGroups(false).then(function(result) {
          var groups = result.data.groups,
          currenTitle = _.find(groups, {
            'id': vmDash.activeGroupId
          });
          if (angular.isDefined(currenTitle)) {
            utilities.setGroupTitle(currenTitle.name);
          }
        });


        vmDash.enableScore = (vmDash.activeGroupId === 'gmat' || vmDash.activeGroupId === 'act' || vmDash.activeGroupId === 'sat');
        if (vmDash.enableScore)
          SimpleDashBoard.fetchScorePrediction();


        SimpleDashBoard.getHistoryInformation();

        SimpleDashBoard.fetchTracksData();

        SimpleDashBoard.getChallenge(vmDash.activeGroupId);

        vmDash.historyVisible = false;
      });
    };


    var SimpleDashBoard = {
      fetchTracksData: function() {
        vmDash.loading = true;
        Tracks.getTracks().allByGroup(vmDash.activeGroupId, true).then(function(response) {
          vmDash.tracks = response.data.tracks;
          vmDash.loading = false;

        }).catch(function errorHandler(e) {

          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      },
      fetchScorePrediction: function() {
        Users.getUser().scorePrediction(vmDash.user_id, vmDash.activeGroupId).then(function(scorePrediction) {

          var scoreData = {};
          vmDash.score = scorePrediction.data;
          if (scorePrediction.data.total_score != null && scorePrediction.data.range != null) {

            scoreData.totalScore = scorePrediction.data.total_score;
            scoreData.rangeInit = scorePrediction.data.range[0];
            scoreData.rangeEnd = scorePrediction.data.range[1];

          } else {
            scoreData.totalScore = 0;
            scoreData.rangeInit = 0;
            scoreData.rangeEnd = 0;
          }
          vmDash.scoreLoading = false;
          vmDash.scoreData = scoreData;

        }).catch(function errorHandler(e) {
          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      },
      getHistoryInformation: function() {
        vmDash.loading = true;
        Users.getUser().history(vmDash.user_id, vmDash.activeGroupId).then(function(graphicResult) {
          var graphicData = graphicResult.data;
          if (angular.isDefined(graphicData) && graphicData.history.length > 0) {
            vmDash.historyVisible = true;
            vmDash.historyInfo = {};
            vmDash.historyInfo.totalQuest = history.getTotalQuestionsAnswered(graphicData);
            vmDash.historyInfo.totalQuestLastW = history.getLastWeekQuestionsAnswered(graphicData);
            vmDash.historyInfo.totalQuestToday = history.getTodayQuestionsAnswered(graphicData);
            vmDash.loading = false;
          } else {
            vmDash.historyVisible = false;
          }


        }).catch(function errorHandler(e) {

          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      },
      getChallenge: function(groupId) {
        Challenge.challengeGames().getChallenge(groupId).then(function(result) {
          var response = result.data;
          if (!_.isEmpty(response.challenge_games)) {
            vmDash.isChallengeAvailable = true;
            vmDash.challengesGames = response.challenge_games;

          }
        });
      }
    };
  }
})();
