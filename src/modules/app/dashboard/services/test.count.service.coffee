testCountService = (storage,dateUtils,utilities)->
  new class TestCountService
    constructor:->

    getLeftDays:(testDate)->

      if testDate > new Date()
        date1 = new Date()
        date2 = new Date testDate
        return dateUtils.daysBetweenDates date1, date2
      return 0

    getCountDownData:(groupId)->
      key = groupId + '_test_count'
      testDay = storage.get(key)
      if utilities.existy testDay
        date = new Date testDay.date
        testDay.days = @getLeftDays(date)
        @setData(testDay)
        return testDay

    setData:(data)->
      key = data.groupId + '_test_count'
      storage.save(key,data)

    deleteTestDay:(groupId)->
      key = groupId + '_test_count'
      storage.remove(key)

testCountService.$inject = ['storage','dateUtils','utilities']
module.exports = testCountService