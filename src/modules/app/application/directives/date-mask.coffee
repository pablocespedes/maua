'use strict'
dateMask = ($filter)->
  new class DateMask
    link: (scope, element, attrs, ctrl) ->
      ctrl.$formatters.unshift (modelValue) ->
        console.log modelValue, 'test 1'
        $filter('date') modelValue
      ctrl.$parsers.unshift (viewValue) ->
        console.log viewValue, 'test'
        $filter('date') viewValue
      return
    restrict: 'A'
    require: 'ngModel'

dateMask.$inject = ['$filter']
module.exports = dateMask

