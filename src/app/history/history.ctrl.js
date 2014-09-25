(function(app) {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['HistoryApi'];

  function HistoryController(HistoryApi) {
    // dummy data for pagination
    var self = this,
        groupId = 'gmat',
        userId = 'd545bea0-fd4b-0130-d42c-1231390ef981';
    this.groupId = groupId;
    HistoryApi.get({ groupId: groupId, userId: userId}).$promise.then(function(data) {
      var questionsWithDay = _.map(data.round_sessions, function(question) {
        var date = new Date(question.answered_at);
        question.day = getStandardDate(date);
        question.time_to_answer = secondsBetweenDates(question.created_at, question.answered_at);
        return question;
      }),
          grouppedByDay = _.groupBy(questionsWithDay, 'day'),
          parsedQuestions = _.map(_.keys(grouppedByDay), function(key) {
            return {day: key, questions: grouppedByDay[key]};
          });

      self.questionsPerDay = parsedQuestions;
    });
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
    this.currentPage = 1;
    this.pageChanged = function() {
    };

  }
})();
