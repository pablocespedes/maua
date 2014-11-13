(function() {
  'use strict';
  var components = angular.module('grockitApp.components');
  components.directive('historyList', historyList);
  components.directive('whenScrolled', whenScrolled);
  components.directive('setHeight', setHeight);
  components.factory('collapseManager', collapseManager);

  historyList.$inject =['collapseManager'];
  setHeight.$inject =['$window'];

  function collapseManager() {
    return {
      entries: [],
      put: function(id, isCollapsed) {
        var entry = this.get(id);
        if (entry) {
          entry.isCollapsed = isCollapsed;
        } else {
          this.entries.push({id: id, isCollapsed: isCollapsed});
        }
      },
      get: function(id) {
        return _.find(this.entries, {'id': id});
      },
      isCollapsed: function(id) {
        var entry = this.get(id);
        return entry ? entry.isCollapsed : false;
      },
      areAllCollapsed: function() {
        return _.every(this.entries, {'isCollapsed': true});
      }
    }
  };

  function historyList(collapseManager) {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/history/templates/history-list.tpl.html',
      scope: {
        identifier: '@',
        title: '@',
        groupId: '=',
        roundSessions: '=',
        onCollapse: '&'
      },
      controller: function($scope) {
        $scope.isCollapsed = collapseManager.isCollapsed($scope.identifier);
        collapseManager.put($scope.identifier, $scope.isCollapsed);

        $scope.toggle = function() {
          $scope.isCollapsed = !$scope.isCollapsed;
          collapseManager.put($scope.identifier, $scope.isCollapsed);
          $scope.onCollapse();
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
