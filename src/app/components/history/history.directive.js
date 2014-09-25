angular.module('grockitApp.components')

  .directive('historyList', historyList);

  function historyList() {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/history/templates/history-list.tpl.html',
      scope: {
        title: '@',
        questions: '='
      },
      link: function(scope, elem, attrs) {
        this.currentPage = 1;
      }
    };

    return directive;
  }
