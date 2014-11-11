(function() {
  'use strict';
  angular
  .module('grockitApp.components')
  .directive('historyList', historyList)
  .directive('whenScrolled', whenScrolled);

  function historyList() {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/history/templates/history-list.tpl.html',
      scope: {
        title: '@',
        groupId: '=',
        roundSessions: '='
      },
      link: function(scope, elem, attrs) {
        this.currentPage = 1;
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
    };å
  }





})();
