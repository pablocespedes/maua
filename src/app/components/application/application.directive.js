(function() {
  'use strict';
  angular
    .module("grockitApp.components")
    .directive('youtube', youtube)
    .directive('breadcrumb', breadcrumb)
    .directive('fadingText', fadingText)
    .directive('welcome', welcome)
    .directive('grockitLink', grockitLink)
    .directive('chardinTour', chardinTour)
    .directive('userProgress', userProgress)
    .directive('scorePrediction', scorePrediction)
    .directive('spinner', spinner)
    .directive('timerSlider', timerSlider)
    .directive('userSettings', userSettings);

  grockitLink.$inject = ['$location', '$timeout'];
  timerSlider.$inject = ['questionTimingService'];

  function youtube() {
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      $(element).YouTubeModal({
        autoplay: 0,
        height: 480,
        width: '100%'
      });
    }
  }

  function breadcrumb() {
    var directive = {
      templateUrl: 'app/components/application/templates/breadcrumb.tpl.html',
      restrict: 'A',
      scope: {
        breadcrumbs: '='
      }
    };
    return directive;
  }

  function fadingText() {
    var directive = {
      link: link,
      templateUrl: 'app/components/application/templates/fading-text.tpl.html',
      restrict: 'A',
      scope: {
        word: '=',
        isVisible: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
      scope.word = scope.word.split("");
    }
  }

  function welcome() {
    var directive = {
      templateUrl: 'app/components/application/templates/welcome.tpl.html',
      restrict: 'A',
      scope: {
        data: '=data',
        url: '=',
        logOutUrl: '=',
        logOut: '&'
      }
    };
    return directive;
  }

  function grockitLink($location, $timeout) {
    var directive = {
      templateUrl: 'app/components/application/templates/a.leftMenu.tpl.html',
      restrict: 'A',
      scope: {
        canAccess: '=',
        url: '=',
        text: '=',
        menuId: '=',
        groupId: '=',
        isReady: '=',
        iconClass: '='
      }
    };
    return directive;
  }

  function chardinTour() {
    var directive = {
      link: link,
      scope: {
        text: '@overlayText',
        position: '@overlayPosition'
      }

    };
    return directive;

    function link(scope, elem, attrs) {
      angular.element('#' + attrs.id).attr('data-intro', scope.text);
      angular.element('#' + attrs.id).attr('data-position', scope.position);

    }
  }

  function userProgress() {
    var directive = {
      templateUrl: 'app/components/application/templates/user-progress.tpl.html',
      restrict: 'A',
      scope: {
        progressInfo: '='
      }
    };
    return directive;
  }

  function scorePrediction() {
    var directive = {
      templateUrl: 'app/components/application/templates/score.prediction.tpl.html',
      restrict: 'A',
      link: link,
      scope: {
        groupTitle: '=',
        isVisible: '=',
        noScoreMessage: '@',
        scoreData: '='
      }
    };

    return directive;

    function link(scope, element, attrs) {
      scope.hasScore = function() {
        return (scope.scoreData.incomplete === false && scope.scoreData.totalScore !== null && scope.scoreData.totalScore > 0)
      };
    }
  }

  function spinner() {
    var directive = {
      templateUrl: 'app/components/application/templates/spinner.tpl.html',
      restrict: 'A'
    };
    return directive;
  }

  function timerSlider(questionTimingService) {

    var directive = {
      templateUrl: 'app/components/application/templates/timer.slider.html',
      restrict: 'AE',
      link: link,
      scope: {
        options: '='
      }
    }

    return directive;

    function link(scope, element, attrs) {

      angular.element(document).ready(function() {
        scope.timerSetting = {
          minutes: 0
        };

        var time = questionTimingService.getTime();
        if (angular.isDefined(time)) {
          scope.timerSetting.minutes = time.minutes;
        }


        var slider = new Slider("#ex13", {
          ticks: scope.options.sliderTicks,
          ticks_labels: scope.options.tickLabels,
        });

        slider.setValue(scope.options.value)

        slider.on('slideStop', function(newValue) {
          scope.timerSetting.minutes = newValue;
          questionTimingService.saveTime(scope.timerSetting);
        });

        scope.$on('$destroy', function() {

          console.log("destroy");
          //slider.destroy();
          //slider = null;
        });
      });

    }

  }

  function userSettings() {
    var directive = {
      templateUrl: 'app/components/application/templates/user-settings.html',
      restrict: 'AE',
      link: link
    }

    function link(scope, element, attr) {

      scope.questionCheck = true;

      scope.options = {
        id: 'userTiming',
        value: 3,
        snapBounds: 1,
        sliderTicks: [0, 5, 10, 15],
        tickLabels: ['0', '5', '10', '15']
      };

      $('#practice-settings-toggler').click(function() {
        $('#practice-settings').toggleClass('open');
        return false;
      });


    }

    return directive;

  }


})();
