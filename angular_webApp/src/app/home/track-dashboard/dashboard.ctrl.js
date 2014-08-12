'use strict';
practiceGame.controller('TrackDashController',['$scope','Users','History','Utilities','Auth','breadcrumbs','Alerts','Tracks',
function($scope,Users,History,Utilities,Auth,breadcrumbs,Alerts,Tracks) {

  var trackData = Utilities.getActiveTrack();
  $scope.trackInfo = {
    titleQuest: trackData.trackTitle,
    trackId: trackData.id
  };



  var TrackDashboard = {
    fetchTracksData: function () {
      $scope.loading = true;
      Tracks.getTracks().allByGroup($scope.activeGroupId).then(function (response) {
        $scope.tracks = response.data.tracks;
        $scope.loading = false;

      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
      });

    },
    fillTrackDashboardGraphic: function (graphicData) {
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
          gridLineColor: '#2e9be2',
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
    getHistoryInformationByTrack: function () {
      $scope.loading = true;
      Users.getUser().history($scope.user_id, $scope.activeGroupId, $scope.trackInfo.trackId).then(function (graphicResult) {
        TrackDashboard.fillTrackDashboardGraphic(graphicResult.data);

      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
      });
    }

  };

  $scope.newChallenge = function () {
    Utilities.redirect('https://grockit.com/assessment/introcards/70478c67-5f6d-4ed5-bc1f-8a5be486bff9');
  };
  $scope.init = function () {
    Auth.getCurrentUserInfo().then(function(userInfo){
      $scope.activeGroupId=userInfo.currentGroup;
      $scope.user_id = userInfo.userId;
      $scope.breadcrumbs = breadcrumbs;
      TrackDashboard.getHistoryInformationByTrack();
      TrackDashboard.fetchTracksData();
    });

  };
  $scope.init();


}]);