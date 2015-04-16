'use strict'
numericEntry = (entriesService)->
  new class NumericEntry
    constructor: () ->
    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/numericEntry.tpl.html',
    scope:
      items: '=items'
      showExplanation: '='
      portal: '='
      answerStatus: '='
    link: (scope, element, attrs) ->

      scope.$watch 'portal.numerator', (newVal, oldVal) ->
        scope.isNumeratorValid = entriesService.validateNumber(newVal)

        scope.portal.isDisabled = if scope.isNumeratorValid is null
        then scope.isNumeratorValid else !scope.isNumeratorValid

        entriesService.handleValidation scope.isNumeratorValid

numericEntry.$inject = ['entriesService']
module.exports = numericEntry
