(function(app) {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['$scope', 'HistoryApi', 'currentProduct'];

  function HistoryController($scope, HistoryApi, currentProduct) {
    // dummy data for pagination
    var vmHist = this;
    vmHist.currentPage = 1;
    vmHist.groupId = null;
    vmHist.questionsPerDay = [];
    vmHist.isLoaded = false;

    vmHist.pagination = {
      totalQuestions: 0,
      itemsPerPage: 0,
      currentPage: 1,
      changePage: function(page) {
        console.log('changePage: ', page);
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
      console.log('loadQuestions: ', page);
      HistoryApi.getQuestions(groupId, page).then(function(response) {
        var questionsWithDay = _.map(response.data.round_sessions, function(question) {
          var date = new Date(question.answered_at);
          question.day = getStandardDate(date);
          question.time_to_answer = secondsBetweenDates(question.created_at, question.answered_at);
          return question;
        }),
            grouppedByDay = _.groupBy(questionsWithDay, 'day'),
        parsedQuestions = _.map(_.keys(grouppedByDay), function(key) {
          return {day: key, questions: grouppedByDay[key]};
        });

      vmHist.questionsPerDay = parsedQuestions;

      var meta = response.data.meta;
      vmHist.pagination.totalQuestions = meta.total_entries;
      vmHist.pagination.itemsPerPage = meta.per_page;

      vmHist.isLoaded = true;
      console.log(vmHist.pagination);
      });
    }
    function secondsBetweenDates(date1, date2) {
      date1 = new Date(date1);
      date2 = new Date(date2);
      return Math.abs(date2.getTime() - date1.getTime()) / 1000;
    }
    function getStandardDate(date) {
      var day = date.getDate(),
          month = date.getMonth();
      return getMonthName(month) + ' ' + day;
    }
    function getMonthName(index) {
      var monthNames = [ "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December" ];
      return monthNames[index];
    }

  }
})();
