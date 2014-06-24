'use strict';
home.controller('SimpleDashController',['$scope','Users','History','Tracks','Utilities','Auth','SubTracks', function($scope,Users,History,Tracks,Utilities,Auth,SubTracks) {

    $scope.activeGroupId= Utilities.getActiveGroup();

    $scope.init = function(){
        $scope.scoreVisible=false;
        $scope.historyVisible=false;
        Utilities.hideFooter();
         $scope.user_id= Auth.getCurrentUserInfo().userId;
         //Declare User RestAngular Object
         $scope.UserRequest = Users.one();

        fetchScorePrediction();

        getHistoryInformation();

        fetchTracksData();
    };

    function fetchTracksData(){
        var tracks =Tracks.one();

         tracks.customGET('',{group_id : $scope.activeGroupId}).then(function(response){
             $scope.tracks = response.tracks;
         }).catch(function error(msg) {
             console.error(msg);
         });
    }

    function fetchScorePrediction(){

        $scope.UserRequest.one($scope.user_id).customGET('score_prediction',{group:$scope.activeGroupId}).then(function(response){
            if(response.total_score!=null &&response.range!=null) {
                $scope.scoreVisible=true;
                $scope.totalScore = response.total_score;
                $scope.rangeInit = response.range[0];
                $scope.rangeEnd = response.range[1];
                $scope.percent = Math.round(100 * response.range[0] / response.range[1]);
            }
            else{
                $scope.scoreVisible=false;
            }

        }).catch(function error(msg) {
            console.error(msg);
        });

    }

    function getHistoryInformation(){

            $scope.UserRequest.one($scope.user_id).customGET('history', {group: $scope.activeGroupId}).then(function (graphicResult) {
                FillGraphic(graphicResult);
            }).catch(function error(msg) {
                console.error(msg);
            });

   }

    function FillGraphic(graphicData){

        if(angular.isDefined(graphicData) &&graphicData.history.length>0){
            $scope.historyVisible=true;
            var response = History.findMissingDates(graphicData.history);
            $scope.chart_options = {
                data:response.Data,
                xkey: 'day',
                ykeys: ['total_questions'],
                labels: ['Questions Answered'],
                lineColors: ['#2e9be2'],
                lineWidth: 2,
                pointSize: 4,
                //ymin:0,
//                ymax:response.MaxLine+5,
                numLines: response.MaxLine,
                //gridIntegers: true,
                hideHover: true,
                //onlyIntegers:false,
                gridLineColor: '#2e9be2',//'rgba(255,255,255,.5)',
                resize: true,
                gridTextColor: '#1d89cf',
                xLabels: "day",
                xLabelFormat: function(d) {
                    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate();
                },
                dateFormat: function(date) {
                    var  d = new Date(date);
                    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate() +', '+d.getFullYear();
                }
            };
        }
        else{
            $scope.historyVisible=false;
        }

    }

    $scope.StartPractice = function(index){
        if(angular.isDefined(index)) {

            var tracks = [],
                trackTitle = $scope.tracks[index].name;
                tracks.push($scope.tracks[index].id);

            var trackData = {
                tracks: tracks,
                trackTitle: trackTitle
            };

            Utilities.setActiveTrack(trackData);

            window.location.href = '/#/' + $scope.activeGroupId + '/practice';
        }
        else{
            bootbox.alert('You must select one track at least');
        }


    };

$scope.init();

}]);
