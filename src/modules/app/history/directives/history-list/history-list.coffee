'use strict'
historyList = (collapseManager)->
  new class HistoryList
    restrict: 'AE'
    replace: true
    templateUrl: 'app/history/directives/history-list/history-list.html'
    scope:
      identifier: '@'
      groupId: '='
      roundSessions: '='
      isLoading: '&'
      onCollapse: '&'
    controller: ($scope) ->
      updateEntry = (isCollapsed) ->
        $scope.isCollapsed = isCollapsed
        collapseManager.put $scope.identifier, $scope.isCollapsed

      updateEntry collapseManager.isCollapsed($scope.identifier)

      $scope.toggle = ->
        updateEntry !$scope.isCollapsed
        $scope.onCollapse()

historyList.$inject = ['collapseManager']
module.exports = historyList
