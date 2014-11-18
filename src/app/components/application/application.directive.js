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
    .directive('spinner', spinner);

  grockitLink.$inject = ['$location', '$timeout'];

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
      link: link,
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

    function link(scope, elm, attr) {

      var leftNav = $('div#main-menu-inner ul.navigation li');
      var url = window.location.href.split('/');
      var currentLoc = url[(url.length - 1)] || 'dashboard';

      switch (currentLoc) {
        case "dashboard":
        case "custom-practice":
         leftNav.removeClass('active');
          $(leftNav[0]).addClass('active');
          break;
        case "history":
          leftNav.removeClass('active');
          var position = leftNav[leftNav.length - 1];
          $(position).addClass('active');
          break;
      }

    }
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

})();
