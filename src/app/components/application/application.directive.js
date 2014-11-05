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
    .directive('userProgress',userProgress);

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

    function grockitLink() {
        var directive = {
            templateUrl: 'app/components/application/templates/a.leftMenu.tpl.html',
            restrict: 'A',
            scope: {
                canAccess: '=',
                url: '=',
                text: '=',
                groupId: '=',
                isReady: '=',
                iconClass: '=',
                isExternalLink: '='
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
        usersInfo: '='
      }
    };
    return directive;
  }




})();
