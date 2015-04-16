'use strict'
fractionEntry = (entriesService)->
  new class FractionEntry
    constructor: () ->
    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/fractionEntry.tpl.html',
    scope:
      items: '=items'
      showExplanation: '='
      portal: '='
      answerStatus: '='
      isConfirmClicked: '='
    link: (scope, element, attrs) ->

      scope.status = ->
        scope.isConfirmClicked and scope.answerStatus or
         !scope.isConfirmClicked and scope.isNumeratorValid and
          scope.isDenominatorValid

      scope.$watch 'portal.numerator', (newVal, oldVal) ->
        scope.isNumeratorValid = entriesService.validateNumber(newVal)

        scope.portal.isDisabled = if scope.isNumeratorValid == null and
         scope.isDenominatorValid == null then false
         else !scope.isDenominatorValid or !scope.isNumeratorValid

        entriesService.handleValidation scope.isNumeratorValid and
         scope.isDenominatorValid
        return

      scope.$watch 'portal.denominator', (newVal, oldVal) ->
        scope.isDenominatorValid = entriesService.validateNumber(newVal)

        scope.portal.isDisabled = if scope.isNumeratorValid == null and
         scope.isDenominatorValid == null then false
         else !scope.isDenominatorValid or !scope.isNumeratorValid

        entriesService.handleValidation scope.isNumeratorValid and
         scope.isDenominatorValid
        return

      return

fractionEntry.$inject =['entriesService']
module.exports = fractionEntry