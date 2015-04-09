(function() {
  'use strict';
  angular
    .module("grockitApp.components")
    .directive('youtube', youtube)
    .directive('breadcrumb', breadcrumb)
    .directive('fadingText', fadingText)
    .directive('welcome', welcome)
    .directive('grockitLink', grockitLink)
    .directive('userProgress', userProgress)
    .directive('scorePrediction', scorePrediction)
    .directive('spinner', spinner)
    .directive('timerSlider', timerSlider)
    .directive('userSettings', userSettings);

  grockitLink.$inject = ['$location', '$timeout'];
  timerSlider.$inject = ['questionTimingService'];
  userSettings.$inject = ['questionTimingService'];

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
      template: '<div><input class="slider-input" type="text" /></div>',
      restrict: 'AE',
      link: link,
      controller: sliderTimerCtrl,
      scope: {
        options: '=',
        timerSetting: '='
      }
    }

    return directive;

    function link(scope, element, attrs, sliderTimerCtrl) {

      var slider = new Slider("input.slider-input", {
        id: scope.options.id,
        ticks: scope.options.sliderTicks,
        ticks_labels: scope.options.tickLabels,
      });

      slider.setValue(scope.options.value)

      slider.on('slideStop', function(newValue) {

        var time = questionTimingService.getTime();
        sliderTimerCtrl.updateTime(time, scope.options);

        scope.$apply(function() {
          scope.options.value = newValue;
          scope.timerSetting.minutes = newValue;
        });
        questionTimingService.saveTime(scope.timerSetting);
        slider.setValue(scope.timerSetting.minutes)
      });

    }

  }

  function userSettings(questionTimingService) {
    var directive = {
      templateUrl: 'app/components/application/templates/user-settings.html',
      restrict: 'AE',
      link: link,
      controller: sliderTimerCtrl
    }

    function link(scope, element, attr, sliderTimerCtrl) {
      scope.timerSetting = {
        minutes: 0
      }
      scope.options = {
        id: 'userTiming',
        value: scope.timerSetting.minutes,
        snapBounds: 1,
        sliderTicks: [0, 5, 10, 15],
        tickLabels: ['0', '5', '10', '15']
      };

      var time = questionTimingService.getTime();
      sliderTimerCtrl.updateTime(time, scope.options);
      scope.questionCheck = scope.options.value !== 0 ? true : false;

      scope.enableTime = function() {
        scope.questionCheck = !scope.questionCheck;
        if (!scope.questionCheck) {
          scope.timerSetting.minutes = 0;
          scope.options.value = 0;
          questionTimingService.saveTime(scope.timerSetting);

        }
      }

      $('#practice-settings-toggler').click(function() {
        $('#practice-settings').toggleClass('open');
        return false;
      });


    }

    return directive;

  }

  function sliderTimerCtrl() {
    this.updateTime = function(time, options) {
      if (angular.isDefined(time) && time !== null) {
        options.value = time.minutes;

      }
    }

  }


})();
