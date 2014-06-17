'use strict';
home.controller('SimpleDashController',['$scope','Users','History','Tracks','Footer','Groups','Auth', function($scope,Users,History,Tracks,Footer,Groups,Auth) {

    $scope.activeGroupId= Groups.getActiveGroup();
    $scope.init = function(){
        Footer.hideFooter();
        angular.element('.progress-bar').tooltip();
         $scope.user_id= Auth.getCurrentUserInfo().userId;
         //Declare User RestAngular Object
         $scope.UserRequest = Users.one();

        fetchScorePrediction();

        getHistoryInformation();

        fetchTracksData();
    };

    function fetchTracksData(){
        var tracks = Tracks.one();
         tracks.customGET('',{group_id : $scope.activeGroupId}).then(function(response){
             $scope.tracks = response.tracks;
         }).catch(function error(msg) {
             console.error(msg);
         });
    }

    function fetchScorePrediction(){

        var easyPieChartDefaults = {
            animate: 2000,
            scaleColor: false,
            lineWidth: 6,
            lineCap: 'square',
            size: 145,
            trackColor: '#e5e5e5'
        };

        $scope.UserRequest.one($scope.user_id).customGET('score_prediction',{group:$scope.activeGroupId}).then(function(response){
            if(response.total_score!=null &&response.range!=null) {
                $scope.totalScore = response.total_score;
                $scope.rangeInit = response.range[0];
                $scope.rangeEnd = response.range[1];
                $scope.percent = Math.round(100 * $scope.rangeInit / $scope.rangeEnd);

                angular.element('#easy-pie-chart-2').easyPieChart(easyPieChartDefaults).data('easyPieChart').update($scope.percent);

            }
            else{
                $scope.scoreVisible=false;
            }

        }).catch(function error(msg) {
            console.error(msg);
        });

    }

    function getHistoryInformation(){

           var analytics = $scope.UserRequest.one($scope.user_id).customGET('history',{group:$scope.activeGroupId}).then(function(graphicResult){
               FillGraphic(graphicResult);
           }).catch(function error(msg) {
            console.error(msg);
        });


   }

    function FillGraphic(graphicData){


        if(angular.isDefined(graphicData) &&graphicData.history.length>0){
            var response = History.findMissingDates(graphicData.history);
            Morris.Line({
                element: 'hero-graph',
                data:response.Data,
                xkey: 'day',
                ykeys: ['total_questions'],

                labels: ['Questions Answered'],
                lineColors: ['#2e9be2'],
                lineWidth: 2,
                pointSize: 4,
                numLines: response.MaxLine,
                hideHover: true,
                onlyIntegers:false,
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
            });
        }
        else{
            $scope.historyVisible=false;
        }


    }

    $scope.StartPractice = function(){
        if(angular.isDefined($scope.selectedTrack)){

           var trackData=$scope.selectedTrack.id;
           Groups.setActiveTrack(trackData);

            window.location.href='/#/'+$scope.activeGroupId+'/practice';
        }
        else{
            bootbox.alert('You must select one track at least');
        }


    };

    $scope.init();


}]);
