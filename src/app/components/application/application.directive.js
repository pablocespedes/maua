(function() {
  'use strict';
  angular
  .module("grockitApp.components")
  .directive('youtube', youtube)
  .directive('breadcrumb', breadcrumb)
  .directive('fadingText', fadingText)
  .directive('welcome', welcome)
  .directive('isActiveNav',isActiveNav)
  .directive('grockitLink',grockitLink);

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

     var directive = {
      link:link,
      replace:true,
      restrict: 'A',
    }
    return directive;

    function link(scope, element, attrs) {
      scope.location = $location;
      Observable.get('isActiveNav').register(function(currentPath) {

         if (currentPath.split("/")[2] === attrs.url.replace(/'/g,"")) {
          $timeout(function(){
             element.addClass('active');
           },500);
        } else if(currentPath.split("/")[2] === 'custom-practice'){
          angular.element('#dashboardLi').addClass('active')
        }else {
          element.removeClass('active');
        }
      });
    }
  }

  function grockitLink() {
    var directive = {
      templateUrl: 'app/components/application/templates/a.LeftMenu.tpl.html',
      restrict: 'A',
      scope: {
        isExternalLink:'=',
        externalBaseUrl: '=',
        canAccess: '=',
        url: '=',
        text: '=',
        groupId:'=',
        isReady:'=',
        iconClass:'='
      }
    };
    return directive;

  }



})();
