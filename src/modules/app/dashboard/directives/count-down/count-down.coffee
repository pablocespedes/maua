'use strict'
countDown = (testCountService,utilities)->
  new class CountDown
    constructor: () ->
    restrict: 'AE'
    templateUrl: 'app/dashboard/directives/count-down/count-down.html'
    scope:
      testDay:'='
      groupTitle: '='
      testData: '='
      groupId:'='
    link:(scope,attr,elm)->

      scope.arrows =
        year:
          left: 'assets/images/white_arrow_left.png',
          right: 'assets/images/white_arrow_right.png'
        month:
          left: 'assets/images/grey_arrow_left.png'
          right: 'assets/images/grey_arrow_right.png'

      scope.testDayExist = ()->
        utilities.existy(scope.testDay)

      scope.removeTestDay = ()->
        testCountService.deleteTestDay(scope.groupId)
        scope.date = null
        scope.testDay = testCountService.getCountDownData(scope.groupId)

      scope.$watch 'date', (newValue)->
        if utilities.existy newValue
          scope.testDay =
            groupId: scope.groupId
            days: testCountService.getLeftDays(newValue)
            date: newValue

          testCountService.setData(scope.testDay)
      return
countDown.$inject = ['testCountService','utilities']
module.exports = countDown


