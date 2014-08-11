'use strict';
home.controller('SimpleDashController',['$scope','Users','History','Tracks','Utilities','Auth','breadcrumbs','Alerts', function($scope,Users,History,Tracks,Utilities,Auth,breadcrumbs,Alerts) {
  $scope.loading = true;
  $scope.scoreLoading = true;
  $scope.getTitle = function(track) {
    return track.short_name;
  };

  $scope.getScore = function(track) {
    return ($scope.score) ? $scope.score.tracks[track.id] : null;
  };

  Utilities.setActiveTab(1);


  $scope.enableScore = ($scope.activeGroupId === 'gmat' || $scope.activeGroupId === 'act' || $scope.activeGroupId === 'sat');

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

        $scope.score = scorePrediction.data;
        if (scorePrediction.data.total_score != null && scorePrediction.data.range != null) {

          $scope.totalScore = scorePrediction.data.total_score;
          $scope.rangeInit = scorePrediction.data.range[0];
          $scope.rangeEnd = scorePrediction.data.range[1];

        } else {
          $scope.totalScore = 0;
          $scope.rangeInit = 0;
          $scope.rangeEnd = 0;
        }
        $scope.scoreLoading = false;

      }).catch(function error(e) {
        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });

    },
    fillGraphic: function (graphicData) {

      if (angular.isDefined(graphicData) && graphicData.history.length > 0) {
        $scope.historyVisible = true;

        var response = History.findMissingDates(graphicData.history);

        $scope.chart_options = {
          data: response.Data,
          xkey: 'day',
          ykeys: ['total_questions'],
          labels: ['Questions Answered'],
          lineColors: ['#2e9be2'],
          lineWidth: 2,
          pointSize: 4,
          numLines: response.MaxLine,
          hideHover: true,
          gridLineColor: '#2e9be2',//'rgba(255,255,255,.5)',
          resize: true,
          gridTextColor: '#1d89cf',
          xLabels: "day",
          xLabelFormat: function (d) {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate();
          },
          dateFormat: function (date) {
            var d = new Date(date);
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
          }
        };

      }
      else {
        $scope.historyVisible = false;
      }
      $scope.loading = false;
    },
    getHistoryInformation: function () {
      $scope.loading = true;
      Users.getUser().history($scope.user_id, $scope.activeGroupId).then(function (graphicResult) {
        SimpleDashBoard.fillGraphic(graphicResult.data);


      }).catch(function error(e) {

        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });
    }
  };

  $scope.init = function () {
    Auth.getCurrentUserInfo().then(function (userInfo) {
      $scope.user_id = userInfo.userId;
      $scope.activeGroupId = userInfo.currentGroup;
      if ($scope.enableScore)
        SimpleDashBoard.fetchScorePrediction();


      SimpleDashBoard.getHistoryInformation();

      SimpleDashBoard.fetchTracksData();


      $scope.breadcrumbs = breadcrumbs;

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
      Utilities.setActiveTab(1);
      Utilities.setActiveTrack(trackData);
      Utilities.redirect('#/' + $scope.activeGroupId + '/dashboard/practice/_');
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
