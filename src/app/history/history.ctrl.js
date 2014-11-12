(function() {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['$scope', 'history', 'currentProduct', 'utilities'];

  function HistoryController($scope, history, currentProduct, utilities) {
    /* jshint validthis: true */
    var vmHist = this,
    historyObj={};
    vmHist.productObserver = currentProduct.observeGroupId().register(updateGroupId);
    vmHist.getQuestions=getQuestions;
    vmHist.loading=true;
    $scope.$on('$destroy', function() {
      currentProduct.unregisterGroup(vmHist.productObserver);
    });

      function getQuestions(){
         vmHist.loading=true;
        history.loadQuestions(vmHist.groupId).then(function(parsedQuestions){
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
