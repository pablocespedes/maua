'use strict'
class FractionEntry
  constructor: () ->
  ## Constructor stuff
  restrict: 'AE'
  replace: true
  templateUrl: 'templates/fractionEntry.tpl.html',
  scope:
    items: '=items'
    showExplanation: '='
    portal: '='
    answerStatus: '='
    isConfirmClicked:'='
  controller: EntriesController
  link: (scope, element, attr, controller) ->
    scope.status = ->
      scope.isConfirmClicked and
      scope.answerStatus or !scope.isConfirmClicked and
       scope.isNumeratorValid and scope.isDenominatorValid

    scope.$watch 'portal.numerator', (newVal, oldVal) ->
      scope.isNumeratorValid = controller.validateNumber(newVal)

      scope.portal.isDisabled = if scope.isNumeratorValid == null and
       scope.isDenominatorValid == null then false else
        !scope.isDenominatorValid or !scope.isNumeratorValid
      
      controller.handleValidation scope.isNumeratorValid and
       scope.isDenominatorValid
      return
    
    scope.$watch 'portal.denominator', (newVal, oldVal) ->
      scope.isDenominatorValid = controller.validateNumber(newVal)
      scope.portal.isDisabled = if scope.isNumeratorValid == null and
       scope.isDenominatorValid == null then false else
        !scope.isDenominatorValid or !scope.isNumeratorValid
      controller.handleValidation scope.isNumeratorValid and
       scope.isDenominatorValid
      return