'use strict'
class MultipleChoice
  constructor: () ->
  ## Constructor stuff
  restrict: 'AE'
  replace: true
  templateUrl: 'templates/multipleChoice.tpl.html',
  scope:
    items: '=items'
    showExplanation: '='
    isConfirmClicked: '='
  link: (scope, element, attr) ->
    
    scope.selectAnswer = (index) ->
      if !scope.isConfirmClicked
        answers = scope.items[index]
        nexAction = $('#nextAction')

        seeAnswer = $('#skipAction')
        if !answers.selected
          answers.selected = true
          nexAction.addClass 'btn-primary'
          seeAnswer.addClass 'hide'
        else
          answers.selected = false
          if !_.find(scope.items, 'selected': true)
            nexAction.removeClass 'btn-primary'
            seeAnswer.removeClass 'hide'
      return