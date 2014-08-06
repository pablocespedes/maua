angular.module('grockitApp.directives', [])
.directive('lineChart', function() {

    function createChart(el_id, options, score) {
      options.element = el_id;
      if (score) {
        angular.element('#columnGraph').addClass('col-sm-8');
      }
      else {
        angular.element('#columnGraph').addClass('col-md-12');
      }

      return new Morris.Line(options);
    }

    return {
      restrict: 'A',
      scope: {
        options: '=',
        score: '='
      },
      replace: true,
      template: '<div></div>',
      link: function (scope, element, attrs) {
        return createChart(attrs.id, scope.options, scope.score)
      }
    }

  })
.directive('easypiechart',function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        percent: '=',
        options: '='
      },
      link: function (scope, element, attrs) {

        scope.percent = scope.percent || 0;

        var pieChart = $(element).easyPieChart({
          animate: 2000,
          scaleColor: false,
          lineWidth: 3,
          lineCap: 'square',
          size: 145,
          barColor: 'white',
          trackColor: 'white'
        }).data('easyPieChart').update(scope.percent);

        scope.$watch('percent', function (newVal, oldVal) {
          pieChart.update(newVal);
        });
      }
    };
  })
.directive('youtube',function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        $(element).YouTubeModal({autoplay: 0, height: 480, width: '100%'});
      }
    };
  });



