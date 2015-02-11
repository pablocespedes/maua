'use strict'
class ProvisionalSat
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
  link: (scope, element, attr) ->
    scope.$watch 'portal.numerator', (newVal, oldVal) ->
      scope.isNumeratorValid = validateEntry(newVal)
      handleValidation scope.isNumeratorValid
      return

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
    return
