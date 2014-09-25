(function() {
  'use strict';
  angular
  .module('grockitApp.history')
  .factory('HistoryApi', HistoryApi);

  HistoryApi.$inject = ['$resource', 'environmentCons'];

  function HistoryApi($resource, environmentCons) {
    // Change URL to include the userid as a parameter
    var url = environmentCons.historyData + ':groupId/:userId.json';
    return $resource(url, {groupId: '@groupId', userId: '@userId'});
  }

})();
