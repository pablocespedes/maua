'use strict';
app.controller('HomeController',['$scope', '$rootScope','$route', 'getApiUrlRequest','ApiRequest', function ($scope,$rootScope,$route,getApiUrlRequest,ApiRequest) {

    $scope.init = function(){
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
        //getUserInformation();

    };

   function getUserInformation(){
       getApiUrlRequest.get().then(function(objUrl){

           var config = {
                   method: "GET",
                   contentType: "application/json",
                   base: '',
                   isArray: false,
                   data:''
               },
               requestUrl= objUrl.baseURLv2+objUrl.request.Users+config.base;

           ApiRequest.doRequest(config,requestUrl).then(function(contentResponse){
               if(contentResponse.$resolved==true){
                   getAnalyticsData();
               }
           });
       });

   };

   function getAnalyticsData(){
        getApiUrlRequest.get().then(function(objUrl){

            var config = {
                    method: "GET",
                    contentType: "application/json",
                    base: 'f58077f0-3084-012d-4d3f-123139068df2/analytics',
                    isArray: false,
                    data:''
                },
                requestUrl= objUrl.baseURLv2+objUrl.request.Users+config.base;

            ApiRequest.doRequest(config,requestUrl).then(function(contentResponse){
                if(contentResponse.$resolved==true){
                    FillGraphic(contentResponse);
                }
            });
        });

    };

   function FillGraphic(graphicData){

        if(angular.isDefined(graphicData)){
            Morris.Line({
                element: 'hero-graph',
                data: graphicData,
                xkey: 'day',
                ykeys: ['total_xp_earned'],
                labels: ['Total XP Earned:'],
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
        }


    };

    $scope.setView= function(activeView){

        $rootScope.view =activeView;
        //$route.reload();
   };


}]);