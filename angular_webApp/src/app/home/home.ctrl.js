/**
 * Created by Jose on 5/8/14.
 */
'use strict';
app.controller('HomeController', function ($scope,$rootScope,$route) {

    $scope.init = function(){

        angular.element('#easy-pie-chart-2').easyPieChart({});
        angular.element('#c-tooltips button').tooltip();

        var uploads_data = [
            { day: '2014-03-10', v: 20 },
            { day: '2014-03-11', v: 10 },
            { day: '2014-03-12', v: 15 },
            { day: '2014-03-13', v: 12 },
            { day: '2014-03-14', v: 5  },
            { day: '2014-03-15', v: 5  },
            { day: '2014-03-16', v: 20 }
        ];
        Morris.Line({
            element: 'hero-graph',
            data: uploads_data,
            xkey: 'day',
            ykeys: ['v'],
            labels: ['Value'],
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

    };


    $scope.setView= function(activeView){

        $rootScope.view =activeView;
        $route.reload();
    };
});