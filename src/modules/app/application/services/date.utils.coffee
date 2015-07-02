dateUtils = () ->
  new class DateUtils
    constructor: () ->

    diffBetweenDates:(date1, date2) ->
      date1 = new Date(date1)
      date2 = new Date(date2)
      return Math.abs(date2.getTime() - date1.getTime())

    secondsBetweenDates : (date1, date2) ->
      @diffBetweenDates(date1, date2) / 1000

    daysBetweenDates : (date1, date2) ->
      timeDiff = @diffBetweenDates date1, date2
      diffDays = Math.ceil timeDiff / (1000 * 3600 * 24)

    getStandardDate : (date) ->
      day = date.getDate()
      month = date.getMonth()
      @getMonthName(month) + ' ' + day

    formatDate : (date) ->
      initialDate = @getStandardDate(date)
      year = date.getYear()
      initialDate + ' ' + year

    getMonthName : (index) ->
      monthNames = [
        'January'
        'February'
        'March'
        'April'
        'May'
        'June'
        'July'
        'August'
        'September'
        'October'
        'November'
        'December'
      ]
      monthNames[index]

module.exports = dateUtils