dateUtils = () ->
  new class DateUtils
    constructor: () ->
    secondsBetweenDates : (date1, date2) ->
      date1 = new Date(date1)
      date2 = new Date(date2)
      Math.abs(date2.getTime() - date1.getTime()) / 1000

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