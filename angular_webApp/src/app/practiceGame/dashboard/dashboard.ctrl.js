practiceGame.controller('TrackDashController',['$scope','TagElement','History','Utilities',function($scope,TagElement,History,Utilities) {


    $scope.init = function(){

        FillGraphic();
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