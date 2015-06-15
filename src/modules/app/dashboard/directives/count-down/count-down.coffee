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

      scope.testDayExist = ()->
        if utilities.existy(scope.testDay)
        then true else false

      scope.removeTestDay = ()->
        testCountService.deleteTestDay(scope.groupId)
        scope.submissionDate = null
        scope.testDay = testCountService.getCountDownData(scope.groupId)

      scope.$watch 'submissionDate', (newValue, oldValue)->
        if utilities.existy newValue
          scope.testDay =
            groupId: scope.groupId
            days: testCountService.getLeftDays(newValue)

          testCountService.setData(scope.testDay)
      return
countDown.$inject = ['testCountService','utilities']
module.exports = countDown


