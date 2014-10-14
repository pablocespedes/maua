(function() {
  'use strict';
  angular
  .module("grockitApp.components")
  .directive('youtube', youtube)
  .directive('breadcrumb', breadcrumb)
  .directive('fadingText', fadingText)
  .directive('welcome', welcome)
  .directive('isActiveNav',isActiveNav);

  isActiveNav.$inject=['$location','Observable','$timeout'];

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


  function isActiveNav($location,Observable,$timeout) {
  var observable = Observable.create('isActiveNav'),
      directive = {
      link:link,
      restrict: 'A',
    }
    return directive;

    function link(scope, element, attrs) {
      scope.location = $location;

      Observable.get('isActiveNav').register(function(currentPath) {

         if (currentPath.split("/")[2] === attrs.ngHref.split("/")[2]) {
          $timeout(function(){
             element.parent().addClass('active');
           },500);
        } else if(currentPath.split("/")[2] === 'custom-practice'){
          angular.element('#dashboardLi').addClass('active')
        }else {
          element.parent().removeClass('active');
        }
      });
    }

  }



})();
