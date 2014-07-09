'use strict';
home.controller('SimpleDashController',['$scope','Users','History','Tracks','Utilities','Auth','breadcrumbs','Alerts', function($scope,Users,History,Tracks,Utilities,Auth,breadcrumbs,Alerts) {

    Utilities.setActiveTab(0);
    $scope.activeGroupId= Utilities.getActiveGroup();
    var SimpleDashBoard= {
        fetchTracksData: function () {
            var tracks = Tracks.one();
            $scope.UserRequest.one($scope.user_id).customGET('score_prediction', {group: $scope.activeGroupId}).then(function (scorePrediction) {
                $scope.score = scorePrediction.data;
                tracks.customGET('', {group_id: $scope.activeGroupId}).then(function (response) {
                    $scope.tracks = response.data.tracks;

                }).catch(function error(error) {

                    Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
                });

            }).catch(function error(error) {

                Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
            });
        },
        fetchScorePrediction: function () {
            $scope.UserRequest.one($scope.user_id).customGET('score_prediction',{group:$scope.activeGroupId}).then(function(response){
                if(response.total_score!=null && response.range!=null) {

                    $scope.scoreVisible=true;
                    $scope.totalScore = response.total_score;
                    $scope.rangeInit = response.range[0];
                    $scope.rangeEnd = response.range[1];
                    $scope.percent = Math.round(100 * response.range[0] / response.range[1]);
                }
                else{
                    $scope.scoreVisible=false;
                }

            }).catch(function error(error) {

                Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
            });

        },
        fillGraphic: function (graphicData) {
            if(angular.isDefined(graphicData) && graphicData.history.length>0) {
                $scope.historyVisible = true;
                $scope.titleDashboard = 'Here is a snapshot of how you\'re doing!';
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
                $scope.titleDashboard = 'You haven’t answered any questions yet.  Select a track below.';
                $scope.historyVisible = false;
            }
        },
        getHistoryInformation: function () {
            $scope.UserRequest.one($scope.user_id).customGET('history', {group: $scope.activeGroupId}).then(function (graphicResult) {
                SimpleDashBoard.fillGraphic(graphicResult.data);

            }).catch(function error(error) {

                Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
            });
        }
    };

    $scope.init = function(){
        var userInfo= Auth.getCurrentUserInfo();
        $scope.user_id= userInfo.userId;

        $scope.breadcrumbs = breadcrumbs;

        $scope.scoreVisible=false;
        $scope.historyVisible=false;
        //Declare User RestAngular Object
        $scope.UserRequest = Users.one();

        SimpleDashBoard.fetchScorePrediction();

        SimpleDashBoard.getHistoryInformation();

        SimpleDashBoard.fetchTracksData();

    };

    $scope.StartPractice = function(index){
        if(angular.isDefined(index)) {

            var tracks = [],
                trackTitle = $scope.tracks[index].name;
                tracks.push($scope.tracks[index].id);

            var trackData = {
                tracks: tracks,
                trackTitle: trackTitle
            };
            Utilities.setActiveTab(0);
            Utilities.setActiveTrack(trackData);
            Utilities.redirect('#/' +  $scope.activeGroupId+ '/dashboard/practice');
        }
        else{
            bootbox.alert('You must select one track at least');
        }


    };

    $scope.init();

}]);
