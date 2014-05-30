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
        getUserInformation();

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

        if(angular.isDefined(graphicData)){
            Morris.Line({
                element: 'hero-graph',
                data: graphicData.analytics,
                xkey: 'day',
                ykeys: ['total_questions'],
                labels: ['Total Questions:'],
                lineColors: ['#fff'],
                lineWidth: 2,
                pointSize: 4,
                gridLineColor: 'rgba(255,255,255,.5)',
                resize: true,
                gridTextColor: '#fff',
                xLabels: "day"//,
             //   xLabelFormat: function(d) {
            //       return d.getYear() + '/' + (d.getMonth() + 1) + '/' + d.getDay();// ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'][d.getMonth()] + ' ' + d.getDay()+ ' ' + d.getDate();
             //   }
            });
        }


    }

    $scope.setView= function(activeView){
        $rootScope.view =activeView;
   };


}]);