(function() {
  'use strict';
  angular
   .module('grockitApp.components')
   .directive('historyList', historyList)
   .directive('whenScrolled', whenScrolled)
   .directive('setHeight', setHeight)

  historyList.$inject =['collapseManager'];
  setHeight.$inject =['$window'];



  function historyList(collapseManager) {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/history/templates/history-list.tpl.html',
      scope: {
        identifier: '@',
        title: '@',
        groupId: '=',
        roundSessions: '='
      },
      controller: function($scope) {
        $scope.isCollapsed = collapseManager.isCollapsed($scope.identifier);
        collapseManager.put($scope.identifier, $scope.isCollapsed);

        $scope.toggle = function() {
          if (collapseManager.collapsedCount() < collapseManager.entries.length - 1 || $scope.isCollapsed) {
            $scope.isCollapsed = !$scope.isCollapsed;
            collapseManager.put($scope.identifier, $scope.isCollapsed);
          }
        }
      }
    };

    return directive;
  }


  function whenScrolled() {
    return function(scope, elm, attr) {
      var raw = elm[0];
      elm.bind('scroll', function() {
        if (raw.scrollTop + raw.offsetHeight +2 >= raw.scrollHeight) {
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
        scope.setHeight = function(){ element.attr('style','height:'+scope.getHeight()); };
        scope.setHeight();

        w.bind('resize', function () {
          scope.setHeight();
          scope.$apply();
        });



      }
    };

    return directive;
  }





})();
