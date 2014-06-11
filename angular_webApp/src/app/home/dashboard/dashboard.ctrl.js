'use strict';
home.controller('SimpleDashController',['$scope','Users','History','Groups', function($scope,Users,History,Groups) {
    $scope.selectedTrack=undefined;
    $scope.init = function(){

        //Declarate User RestAngular Object
         $scope.UserRequest = Users.one();
        var easyPieChartDefaults = {
            animate: 2000,
            scaleColor: false,
            lineWidth: 6,
            lineCap: 'square',
            size: 145,
            trackColor: '#e5e5e5'
        };
        angular.element('#easy-pie-chart-2').easyPieChart(easyPieChartDefaults);
        angular.element('.progress-bar').tooltip();
        getHistoryInformation();
        fetchTracksData();
    };

    function fetchTracksData(){
        var tracks = Groups.one('gre');
         tracks.customGET('tags', {include_unpublished: true}).then(function(response){
             $scope.tracks = response.tracks;
         }).catch(function error(msg) {
             console.error(msg);
         });
    }

    function getHistoryInformation(){

           var analytics = $scope.UserRequest.one('f58077f0-3084-012d-4d3f-123139068df2').customGET('history',{group:'gmat'}).then(function(graphicResult){
               FillGraphic(graphicResult);
           }).catch(function error(msg) {
            console.error(msg);
        });


   }

    function FillGraphic(graphicData){

       var response = History.findMissingDates(graphicData.history);
        if(angular.isDefined(graphicData)){
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


    }


    $scope.StartPractice = function(){
        if(angular.isDefined($scope.selectedTrack)){
            window.location.href=$scope.selectedTrack.group_id+'/#/practice/';
        }
        else{
            bootbox.alert('You must select one track at least');
        }


    };
    $scope.init();


}]);
