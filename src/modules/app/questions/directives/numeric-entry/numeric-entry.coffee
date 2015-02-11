'use strict'
class NumericEntry
  constructor: () ->
  ## Constructor stuff
  restrict: 'AE'
  replace: true
  templateUrl: 'templates/numericEntry.tpl.html',
  scope:
    items: '=items',
    showExplanation: '=',
    portal: '=',
    answerStatus: '='
  controller: EntriesController
  link: (scope, element, attr, controller) ->
    scope.$watch 'portal.numerator', (newVal, oldVal) ->
      
      scope.isNumeratorValid = controller.validateNumber(newVal)
      scope.portal.isDisabled = if scope.isNumeratorValid == null
      then scope.isNumeratorValid else !scope.isNumeratorValid

      controller.handleValidation scope.isNumeratorValid
      return