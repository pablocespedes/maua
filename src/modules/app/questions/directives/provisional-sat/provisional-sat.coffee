'use strict'
provisionalSat =()->
  new class ProvisionalSat
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
        scope.isNumeratorValid = validateEntry(newVal)
        handleValidation scope.isNumeratorValid

      validateEntry = (value) ->
        if angular.isUndefined(value) or value == '' or value == null
          null
        else
          angular.isDefined(value) and value != null

      handleValidation = (isValid) ->
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        if isValid
          nexAction.addClass 'btn-primary'
          seeAnswer.addClass 'hide'
        else
          nexAction.removeClass 'btn-primary'
          seeAnswer.removeClass 'hide'
module.exports = provisionalSat