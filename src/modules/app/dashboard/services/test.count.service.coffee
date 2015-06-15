testCountService = (storage,dateUtils)->
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
      storage.get(key)

    setData:(data)->
      key = data.groupId + '_test_count'
      storage.save(key,data)

    deleteTestDay:(groupId)->
      key = groupId + '_test_count'
      storage.remove(key)

testCountService.$inject = ['storage','dateUtils']
module.exports = testCountService