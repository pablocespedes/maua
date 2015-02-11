'use strict'
class Matrix2x3
  constructor: () ->
  ## Constructor stuff
  restrict: 'AE'
  replace: true
  templateUrl: 'templates/matrix2x3.tpl.html',
  scope:
    items: '=items'
    showExplanation: '='
    isConfirmClicked: '='
  link: (scope, element, attr) ->
    scope.selectAnswer = (index, mGroup) ->
      if !scope.isConfirmClicked
        answer = scope.items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        currentSection = _.filter(scope.items, (answer) ->
          answer.matrix_group == mGroup)

        trueSelected = _.filter(currentSection, 'selected': true)
        if trueSelected
          _.forEach currentSection, (ansResult) ->
            if answer.id != ansResult.id
              ansResult.selected = false
            return
        if !answer.selected
          answer.selected = true
          nexAction.addClass 'btn-primary'
          seeAnswer.addClass 'hide'
        else
          answer.selected = false
          if !_.find(scope.items, 'selected': true)
            nexAction.removeClass 'btn-primary'
            seeAnswer.removeClass 'hide'
      return
    