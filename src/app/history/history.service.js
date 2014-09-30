(function() {
  'use strict';
  angular
  .module('grockitApp.history')
  .factory('historyDates', historyDates)


  function historyDates() {
    var service = {
      secondsBetweenDates: secondsBetweenDates,
      getStandardDate: getStandardDate,
      getMonthName: getMonthName
    }
    return service;


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
      var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[index];
    }
  }


})();
