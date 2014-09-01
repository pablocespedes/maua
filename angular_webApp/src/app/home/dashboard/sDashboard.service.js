home.factory('History', function () {
  function formatDate(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  function getLastWeekDatesRange() {
    var datesRange = {},
      curr = new Date, // get current date
      first = curr.getDate() - curr.getDay(), // First day is the day of the month - the day of the week
      last = first + 6; // last day is the first day + 6

    datesRange.startDate = formatDate(new Date(curr.setDate(first)));
    datesRange.endDate = formatDate(new Date(curr.setDate(last)));
    return datesRange;
  }


  return {
    getTotalQuestionsAnswered: function (historyData) {
      var questArray = _.pluck(historyData.history, 'total_questions');

      return  _.reduce(questArray, function (sum, num) {
        return sum + num;
      });
    },
    getLastWeekQuestionsAnswered: function (historyData) {
      var lastWeekData = getLastWeekDatesRange(),
        filteredData = _.filter(historyData.history, function (data) {
          return data.day >= lastWeekData.startDate && data.day <= lastWeekData.endDate;
        }),
        questArray = _.pluck(filteredData, 'total_questions');
      return  _.reduce(questArray, function (sum, num) {
        return sum + num;
      });
    },
    getTodayQuestionsAnswered: function(historyData){
      var today = formatDate(new Date),
       filteredData = _.filter(historyData.history, function (data) {
        return data.day ==today;
       }),
        questArray = _.pluck(filteredData, 'total_questions');
      return  _.reduce(questArray, function (sum, num) {
        return sum + num;
      });
    }
  }
});
