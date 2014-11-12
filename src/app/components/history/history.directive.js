(function() {
  'use strict';
  angular
  .module('grockitApp.components')
  .directive('historyList', historyList)
  .directive('whenScrolled', whenScrolled)
  .directive('setHeight', setHeight);

  setHeight.$inject =['$window'];

  function historyList() {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/history/templates/history-list.tpl.html',
      scope: {
        title: '@',
        groupId: '=',
        roundSessions: '='
      }
    };

    return directive;
  }


  function whenScrolled() {
    return function(scope, elm, attr) {
      var raw = elm[0];

      elm.bind('scroll', function() {
        if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
          scope.$apply(attr.whenScrolled);
        }
      });
    };
  }

  function setHeight($window){
    var directive = {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var w = angular.element($window);

        scope.getHeight = function(){ return (w.height()-200) +'px'};

        w.bind('resize', function () {
          element.attr('style','height:'+scope.getHeight());
          scope.$apply();
        });



      }
    };

    return directive;
  }





})();
