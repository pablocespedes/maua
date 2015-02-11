'use strict'
class OneChoice
  constructor: () ->
  ## Constructor stuff
  restrict: 'AE'
  replace: true
  templateUrl: 'templates/oneChoice.tpl.html',
  scope:
    items: '=items'
    showExplanation: '='
    totalAnswered: '='
    isConfirmClicked: '='
  link: (scope, element, attr) ->
    scope.selectAnswer = (index) ->
      if !scope.isConfirmClicked
        _.forEach scope.items, (answer, i) ->
          if index != i
            answer.selected = false
          return
        answer = scope.items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        $('.choice button').removeClass 'btn-primary btn-danger'
        if !answer.selected
          answer.selected = true
          nexAction.addClass 'btn-primary'
          seeAnswer.addClass 'hide'
        else
          answer.selected = false
          nexAction.removeClass 'btn-primary'
          seeAnswer.removeClass 'hide'
      return

    