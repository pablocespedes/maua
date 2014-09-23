angular.module('grockitApp.components')

  .directive('historyList', historyList);

  function historyList() {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/history/templates/history-list.tpl.html',
      scope: {
        questionsPerDate: '='
      }
    };

    return directive;
  }
