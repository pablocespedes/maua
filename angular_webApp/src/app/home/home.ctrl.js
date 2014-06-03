'use strict';
app.controller('HomeController',['$scope', '$rootScope','$route','Users', function ($scope,$rootScope,$route,Users) {

    $scope.init = function(){
        //Declarate User RestAngular Object
         $scope.UserRequest = Users.one();
        var easyPieChartDefaults = {
            animate: 2000,
            scaleColor: false,
            lineWidth: 6,
            lineCap: 'square',
            size: 105,
            trackColor: '#e5e5e5'
        };
        angular.element('#easy-pie-chart-2').easyPieChart(easyPieChartDefaults);
        angular.element('.progress-bar').tooltip();
        //getUsserInformation();
        FillGraphic()
    };

   function getUserInformation(){

       $scope.UserRequest.get().then(function(userResult){

           var analytics = $scope.UserRequest.one(userResult.user.id).customGET('analytics').then(function(graphicResult){
               FillGraphic(graphicResult);
           });

       }).catch(function error(msg) {
           console.error(msg);
       });

   }

   function FillGraphic(graphicData){

      /*  if(angular.isDefined(graphicData)){*/
            Morris.Line({
                element: 'hero-graph',
                data: addZeroToEmptyDates(),
                xkey: 'day',
                ykeys: ['total_questions'],
                labels: ['Total Questions:'],
                lineColors: ['#fff'],
                lineWidth: 2,
                pointSize: 4,
                gridLineColor: 'rgba(255,255,255,.5)',
                resize: true,
                gridTextColor: '#fff',
                xLabels: "day",
                xLabelFormat: function(d) {
                    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate();
                }
            });
       /* }*/


    }


  var addZeroToEmptyDates = function(){
      var dates = ["7/13/2011", "7/15/2011", "7/18/2011", "12/23/2011"];

      var minDate = new Date(dates[0]).getTime(),
          maxDate = new Date(dates[dates.length - 1]).getTime();
      var newDates = [],
          currentDate = minDate,
          d;

      while (currentDate <= maxDate) {
          d = new Date(currentDate);

          newDates.push({
                  "day": (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear(),
                  "total_questions": 0,
                  "total_correct": 0,
                  "total_seconds": 0,
                  "total_xp_earned": 0,
                  "total_experience_points": 0
                });

          currentDate += (24 * 60 * 60 * 1000); // add one day

      }

      var object = $.extend({}, test(), newDates);
      console.log(object);
       return newDates;


  }


    var test = function(){
        return [
            {
                "day": "2013-12-04",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2013-12-10",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-01-04",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-01-10",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-01-13",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-01-19",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-01-24",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-01-29",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-02-04",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            },
            {
                "day": "2014-02-09",
                "total_questions": 3,
                "total_correct": 3,
                "total_seconds": 12,
                "total_xp_earned": 24,
                "total_experience_points": 24
            }

        ];

    };

    $scope.setView= function(activeView){
        $rootScope.view =activeView;
   };


}]);