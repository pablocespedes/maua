(function() {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['$scope', 'HistoryApi', 'currentProduct','dateUtils'];

  function HistoryController($scope, HistoryApi, currentProduct,dateUtils) {
     /* jshint validthis: true */
    var vmHist = this;
    vmHist.currentPage = 1;
    vmHist.groupId = null;
    vmHist.questionsPerDay = [];
    vmHist.isLoaded = false;

    vmHist.pagination = {
      totalQuestions: 0,
      itemsPerPage: 0,
      maxSize: 5,
      currentPage: 1,
      changePage: function(page) {
        if (vmHist.groupId) {
          vmHist.pagination.currentPage = page;
          loadQuestions(vmHist.groupId, vmHist.pagination.currentPage);
        }
      }
    };

    vmHist.productObserver = currentProduct.observeGroupId().register(updateGroupId);

    $scope.$on('$destroy', function() {
      currentProduct.unregisterGroup(vmHist.productObserver);
    });


    function updateGroupId(groupId) {
      if (vmHist.groupId !== groupId) {
        vmHist.groupId = groupId;
        vmHist.currentPage = 1;
        loadQuestions(vmHist.groupId, vmHist.currentPage);
      }
    }

    function loadQuestions(groupId, page) {
      HistoryApi.getQuestions(groupId, page).then(function(response) {
        var roundSessions = response.data.round_sessions;
        //var uniqueQuestions = _.unique(roundSessions, 'question_id');
        var questionsWithDay = _.map(roundSessions, function(question) {
          var date = new Date(question.created_at);
          question.day = dateUtils.getStandardDate(date);
          if (question.created_at && question.answered_at) {
            question.time_to_answer = dateUtils.secondsBetweenDates(question.created_at, question.answered_at);
          }
          return question;
        }),
            grouppedByDay = _.groupBy(questionsWithDay, 'day'),
        parsedQuestions = _.map(_.keys(grouppedByDay), function(key) {
          return {day: key, roundSessions: grouppedByDay[key]};
        });

      vmHist.questionsPerDay = parsedQuestions;

      var meta = response.data.meta;
      vmHist.pagination.totalQuestions = meta.total_entries;
      vmHist.pagination.itemsPerPage = meta.per_page;

      vmHist.isLoaded = true;
      console.log(vmHist.pagination);
      });
    }


  }
})();
