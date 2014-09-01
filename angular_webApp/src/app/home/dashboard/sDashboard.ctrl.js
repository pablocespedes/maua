'use strict';
home.controller('SimpleDashController',['$scope','Users','History','Tracks','Utilities','Auth','Alerts', function($scope,Users,History,Tracks,Utilities,Auth,Alerts) {
  $scope.loading = true;
  $scope.scoreLoading = true;
  $scope.loadingMessage = 'Loading...';
  Utilities.setActiveTab(0);


  $scope.getTitle = function(track) {
    return track.short_name;
  };

  $scope.getScore = function(track) {
    return ($scope.score) ? $scope.score.tracks[track.id] : null;
  };


  var SimpleDashBoard = {
    fetchTracksData: function () {
      $scope.loading = true;
      Tracks.getTracks().allByGroup($scope.activeGroupId, true).then(function (response) {
        $scope.tracks = response.data.tracks;
        $scope.loading = false;

      }).catch(function error(e) {

        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });

    },
    fetchScorePrediction: function () {
      Users.getUser().scorePrediction($scope.user_id, $scope.activeGroupId).then(function (scorePrediction) {

        var scoreData = {};
        $scope.score = scorePrediction.data;
        if (scorePrediction.data.total_score != null && scorePrediction.data.range != null) {

          scoreData.totalScore = scorePrediction.data.total_score;
          scoreData.rangeInit = scorePrediction.data.range[0];
          scoreData.rangeEnd = scorePrediction.data.range[1];

        } else {
          scoreData.totalScore = 0;
          scoreData.rangeInit = 0;
          scoreData.rangeEnd = 0;
        }
        $scope.scoreLoading = false;
        $scope.scoreData = scoreData;

      }).catch(function error(e) {
        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });

    },
    getHistoryInformation: function () {
      $scope.loading = true;
      Users.getUser().history($scope.user_id, $scope.activeGroupId).then(function (graphicResult) {
        var graphicData= graphicResult.data;
        if (angular.isDefined(graphicData) && graphicData.history.length > 0) {
          $scope.historyVisible = true;
          $scope.historyInfo={};
          $scope.historyInfo.totalQuest = History.getTotalQuestionsAnswered(graphicData);
          $scope.historyInfo.totalQuestLastW =History.getLastWeekQuestionsAnswered(graphicData);
          $scope.historyInfo.totalQuestToday =History.getTodayQuestionsAnswered(graphicData);
          $scope.loading = false;
        }
        else{
          $scope.historyVisible = false;
        }


      }).catch(function error(e) {

        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });
    }
  };

  $scope.init = function () {
    Auth.getCurrentUserInfo().then(function (userInfo) {
      $scope.user_id = userInfo.userId;
      $scope.activeGroupId = userInfo.currentGroup;
      $scope.enableScore = ($scope.activeGroupId === 'gmat' || $scope.activeGroupId === 'act' || $scope.activeGroupId === 'sat');
      if ($scope.enableScore)
        SimpleDashBoard.fetchScorePrediction();


      SimpleDashBoard.getHistoryInformation();

      SimpleDashBoard.fetchTracksData();

      $scope.historyVisible = false;
    });


  };

  $scope.StartPractice = function (index) {
    if (angular.isDefined(index)) {

      var tracks = [],
        trackTitle = $scope.tracks[index].name;
      tracks.push($scope.tracks[index].id);

      var trackData = {
        tracks: tracks,
        trackTitle: trackTitle
      };
      Utilities.setActiveTab(0);
      Utilities.setActiveTrack(trackData);
      Utilities.redirect('#/' + $scope.activeGroupId + '/custom-practice/');
    }
    else {
      Alerts.showAlert('You must select one track at least', 'warning');
    }


  };

  $scope.newCatTest = function () {
    Utilities.redirect('https://grockit.com/assessment/games/abc25cc0-f24f-0130-2370-1231390ef981');
  };

  $scope.init();

}]);
