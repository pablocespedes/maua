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
    historyObj={};
    vmHist.count=0;
    vmHist.productObserver = currentProduct.observeGroupId().register(updateGroupId);
    vmHist.getQuestions=getQuestions;
    vmHist.loading=true;
    vmHist.onCollapse = onCollapse;

    $scope.$on('$destroy', function() {
      currentProduct.unregisterGroup(vmHist.productObserver);
    });

    function onCollapse() {
      if (collapseManager.areAllCollapsed()) {
        vmHist.getQuestions();
      }
    }

    function getQuestions(){
      vmHist.loading=true;
      history.loadQuestions(vmHist.groupId).then(function(parsedQuestions){
        vmHist.count++;
        vmHist.questionsPerDay = parsedQuestions;
        vmHist.loading=false;
      });
    }

    function updateGroupId(groupId) {
      if (vmHist.groupId !== groupId) {
        vmHist.groupId = groupId;
        getQuestions();
      }
    }

  }
})();
