'use strict'
class TwoChoice
  constructor: () ->
  ## Constructor stuff
  restrict: 'AE'
  replace: true
  templateUrl: 'templates/twoChoice.tpl.html',
  scope:
    maxOpt: '=',
    items: '=items',
    showExplanation: '=',
    isConfirmClicked: '='
  link: (scope, element, attr) ->
    scope.maxOpt = []
    scope.selectAnswer = (index) ->
      if !scope.isConfirmClicked
        answer = scope.items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        if !answer.selected

          ###validation which takes care to keep just 2 options selected###

          if scope.maxOpt.length >= 2
            ansR = _.find(scope.items, 'id': scope.maxOpt[0])
            ansR.selected = false
            scope.maxOpt = _.filter(scope.maxOpt, (num, i) ->
              i != 0
            )
          scope.maxOpt.push answer.id
          answer.selected = true
          nexAction.addClass 'btn-primary'
          seeAnswer.addClass 'hide'
        else
          scope.maxOpt = _.filter(scope.maxOpt, (num) ->
            num != answer.id
          )
          answer.selected = false
          if !_.find(scope.items, 'selected': true)
            nexAction.removeClass 'btn-primary'
            seeAnswer.removeClass 'hide'
      return
