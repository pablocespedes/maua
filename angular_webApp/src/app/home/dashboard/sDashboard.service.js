home.factory('History', function () {
  function formatDate(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  function getLastWeekDatesRange() {
    var datesRange = {},
      today = new Date(),
      lastWeek = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 7);

    datesRange.startDate = formatDate(lastWeek);
    datesRange.endDate = formatDate(today);
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
    getTodayQuestionsAnswered: function (historyData) {
      var today = formatDate(new Date),
        filteredData = _.filter(historyData.history, function (data) {
          return data.day == today;
        }),
        questArray = _.pluck(filteredData, 'total_questions');
      return  _.reduce(questArray, function (sum, num) {
        return sum + num;
      });
    }
  }
});
