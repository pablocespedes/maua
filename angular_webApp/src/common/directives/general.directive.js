angular.module('grockitApp.directives', [])

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

.directive('trackList', function(Utilities) {
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

        scope.getYourScorePredictionUrl = function(track){
          var baseUrl=Utilities.originalGrockit(false).url;
          Utilities.redirect(baseUrl+'/assessment/for_track/'+track.id);
        }
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
      },
      link: function(scope, elem, atttrs) {
        scope.word = scope.word.split("");
      }
    };
  })

.directive("trackToggle", function(){
    return {
      scope: {},
      restrict: 'A',
      transclude:true,
      templateUrl: 'common/templates/directives/toggle-element.tpl.html',
      link: function(scope){
        scope.toggled = false;

        scope.toggle = function(){
          scope.toggled = !scope.toggled;
        }
      }
    }
 })

.directive('btnRadio',function() {
  var activeClass = 'btn-info';

  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {

      var value = scope.$eval(attrs.btnRadio);

      //model -> UI
      scope.$watch(function() {
        return ngModelCtrl.$modelValue;
      }, function(modelValue) {
        if (angular.equals(modelValue, value)) {
          element.addClass(activeClass);
        } else {
          element.removeClass(activeClass);
        }
      });

      //ui->model
      element.bind('click', function() {
        if (!element.hasClass(activeClass)) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(value);
          });
        }
      });
    }
  };
})

.directive('topicList', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/topics-list.tpl.html',
      scope: {
      },
      link: function (scope, element, attrs) {

      }
    };
  })

.directive('historyChart', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/dashboard-history.tpl.html',
      scope: {
        historyInfo: '='
      }
    };
  })

.directive('searchInput', function() {
  return {
    restrict: 'A',
    templateUrl: 'common/templates/directives/search-input.tpl.html'
  };
})

.directive('challengeDashboard', function() {
    return {
      restrict: 'A',
      templateUrl: 'common/templates/directives/dashboard-challenge.tpl.html',
      scope: {
        goChallenge: '&goChallenge',
        titleQuest: '='
      }
    };
  });

