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
  })
.directive('scorePrediction', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/scorePrediction.tpl.html',
      scope: {
        groupTitle: '=',
        totalScore: '=',
        rangeInit: '=',
        rangeEnd: '=',
        isVisible: '=',
        noScoreMessage: '@'
      },
      link: function (scope, element, attrs) {
        scope.hasScore = function () {
          return (scope.totalScore !== null && scope.totalScore > 0);
        };
      }
    };
  })
.directive('trackList', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/track-list.tpl.html',
      scope: {
        tracks: '=',
        startPractice: '=',
        getTitle: '=',
        getScore: '=',
        isVisible: '='
      },
      link: function (scope, element, attrs) {
        scope.hasScore = function (track) {
          return (scope.getScore(track) !== null && scope.getScore(track) > 0);
        };
      }
    };
  })
.directive('breadcrumb', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/breadcrumb.tpl.html',
      scope: {
        breadcrumbs: '='
      }
    };
  })
.directive('fadingText', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/fading-text.tpl.html',
      scope: {
        word: '=',
        isVisible: '='
      }
    };
  })
  .directive('questionTiming', function() {
    return {
      restrict: 'A',
      replace:true,
      templateUrl: 'common/templates/directives/questionTiming.tpl.html',
      scope: {
        data: '='
      }
    };
  })
  .directive('questionTags', function() {
    return {
      restrict: 'A',
      replace:true,
      templateUrl: 'common/templates/directives/questionsTags.tpl.html',
      scope: {
        tags: '=',
        xp: '='
      }
    };
  })

  .directive('answerType', function ($compile) {

    var fractionTpl = '<div ng-fraction-entry answer-status="answerStatus" ' +
        'portal="portalC" items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)" >' +
        '</div>',

      matrix2x3Tpl = '<div ng-multiple-matrix2x3 items="items" show-explanation="showExplanation"' +
        'has-explanation="answerHasExplanation(index)"></div>',

      matrix3x3Tpl = ' <div ng-multiple-matrix3x3 items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)"></div>',

      multipleChoiceTpl = '<div ng-multiple-choice items="items" show-explanation="showExplanation" ></div>',

      numericEntryTpl = '<div ng-numeric-entry answer-status="answerStatus" portal="portalC" items="items" ' +
        'show-explanation="showExplanation" has-explanation="answerHasExplanation(index)"></div>',

      oneChoiceTpl = '<div ng-one-choice items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)"></div>',

      satTpl = ' <div ng-sat></div>',

      twoChoiceTpl = '<div  ng-two-choice items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)"></div>';

    var getAnswerTemplate = function (questionKind) {
      var template = '';

      switch (questionKind) {
        case 'MultipleChoiceOneCorrect':
          template = oneChoiceTpl;
          break;
        case 'MultipleChoiceOneOrMoreCorrect':
          template = multipleChoiceTpl;
          break;
        case 'MultipleChoiceMatrixTwoByThree':
          template = matrix2x3Tpl;
          break;
        case 'MultipleChoiceMatrixThreeByThree':
          template = matrix3x3Tpl;
          break;
        case 'NumericEntryFraction':
          template = fractionTpl;
          break;
        case 'NumericEntry':
          template = numericEntryTpl;
          break;
        case 'sat':
          template = satTpl;
          break;
        case 'MultipleChoiceTwoCorrect':
          template = twoChoiceTpl;
          break;

      }

      return template;
    };

    var linker = function (scope, element, attrs) {
      element.html(getAnswerTemplate(attrs.content)).show();
      $compile(element.contents())(scope);

      scope.$watch('lastAnswerLoaded', function(value){

        element.html(getAnswerTemplate(value)).show();
        $compile(element.contents())(scope);


      });

    };

    return {
      restrict: "A",
      replace: true,
      scope: false,
      link: linker
    };
  });
