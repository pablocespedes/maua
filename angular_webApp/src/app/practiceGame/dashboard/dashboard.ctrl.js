practiceGame.controller('DetailDashController',['$scope','TagElement','History','Utilities',function($scope,TagElement,History,Utilities) {


    $scope.init = function(){
        Utilities.showFooter();
        var easyPieChartDefaults = {
            animate: 2000,
            scaleColor: false,
            lineWidth: 6,
            lineCap: 'square',
            size: 145,
            trackColor: '#e5e5e5'
        };
        angular.element('#scoreP').easyPieChart(easyPieChartDefaults);

        FillGraphic();
    };



    var test = function(){
        return [
            {
                "day": "2013-12-04",
                "total_questions": 2,
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

    function FillGraphic(graphicData){

        var response = History.findMissingDates(test());

        /*  if(angular.isDefined(graphicData)){*/
        Morris.Line({
            element: 'detail-graph',
            data:response.Data,
            xkey: 'day',
            ykeys: ['total_questions'],

            labels: ['Questions Answered'],
            lineColors: ['#fff'],
            lineWidth: 2,
            pointSize: 4,
            numLines: response.MaxLine,
            hideHover: true,
            onlyIntegers:false,
            gridLineColor: 'rgba(255,255,255,.5)',
            resize: true,
            gridTextColor: '#fff',
            xLabels: "day",
            xLabelFormat: function(d) {
                return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate();
            },
            dateFormat: function(date) {
                var  d = new Date(date);
                return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate() +', '+d.getFullYear();
            }
        });
        /* }*/


    }


    $scope.selectLevelCluster= function(event){
        var element = angular.element(event.target),
            value= element.attr('id'),
            text= element.data('tag');
        TagElement.add(value,text);

    };

    $scope.init();


}]);