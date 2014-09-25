(function(app) {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['HistoryApi', 'Observable'];

  function HistoryController(HistoryApi, Observable) {
    // dummy data for pagination
    var self = this;
    HistoryApi.query({ groupId: 'gmat' }).$promise.then(function(data) {
      self.questionsPerDay = data;
    });
    this.currentPage = 1;
    this.pageChanged = function() {
    };

  }
})();
