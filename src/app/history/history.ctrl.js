(function(app) {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = [];

  function HistoryController() {
    // dummy data for pagination
    this.questions = _.range(40);
    this.currentPage = 1;
    this.pageChanged = function() {

    };
  }
})();
