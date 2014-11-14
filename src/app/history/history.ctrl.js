(function() {
  'use strict';
  angular
    .module('grockitApp.history')
    .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['$scope', 'history', 'currentProduct', 'utilities', 'collapseManager'];

  function HistoryController($scope, history, currentProduct, utilities, collapseManager) {
    /* jshint validthis: true */
    var vmHist = this,
      historyObj = {};
    vmHist.productObserver = currentProduct.observeGroupId().register(updateGroupId);
    vmHist.getQuestions = getQuestions;
    vmHist.loading = true;
    vmHist.isRequesting = false;
    vmHist.onCollapse = onCollapse;

    $scope.$on('$destroy', function() {
      currentProduct.unregisterGroup(vmHist.productObserver);
    });

    function getQuestions() {
      vmHist.loading = true;
      if (!vmHist.isRequesting) {
        vmHist.isRequesting = true;
        history.loadQuestions(vmHist.groupId).then(function(parsedQuestions) {
          vmHist.isRequesting = false;
          vmHist.loading = false;
          vmHist.questionsPerDay = parsedQuestions;
        });
      }

    }

    function onCollapse() {
      if (collapseManager.areAllCollapsed()) {
        vmHist.getQuestions();
      }
    }

    function updateGroupId(groupId) {
      if (vmHist.groupId !== groupId) {
        vmHist.groupId = groupId;
        getQuestions();
      }
    }

  }
})();
