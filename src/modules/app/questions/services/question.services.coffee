'use strict'
questionTypeService = ()->
  new class QuestionTypesService
    # Services injected into the controller constructor
    constructor: ()->
      console.log 'ctrl'
    resetSelection : (items, index) ->
      _.forEach items, (answer, i) ->
        if i is index
          answer.selected = false
    findSelectedItems : (items) ->
      _.find items, 'selected': true

    selectOneChoice : (isConfirmClicked, items, index) ->
      if !isConfirmClicked
        _.forEach items, (answer, i) ->
          if index isnt i
            answer.selected = false
          return
        answer = items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        if angular.isUndefined(answer.crossOut) or !answer.crossOut
          $('.choice button').removeClass 'md-primary md-warn'
          if !answer.selected
            answer.selected = true
            nexAction.addClass 'md-primary'
            seeAnswer.addClass 'hide'
          else
            answer.selected = false
            nexAction.removeClass 'md-primary'
            seeAnswer.removeClass 'hide'

    selectMultipleChoice : (isConfirmClicked, items, index) ->
      if !isConfirmClicked
        answers = items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        if angular.isUndefined(answers.crossOut) or !answers.crossOut
          if !answers.selected
            answers.selected = true
            nexAction.addClass 'md-primary'
            seeAnswer.addClass 'hide'
          else
            answers.selected = false
            if !@findSelectedItems(items)
              nexAction.removeClass 'md-primary'
              seeAnswer.removeClass 'hide'

    selectMatrix : (isConfirmClicked, items, index, mGroup) ->

      if !isConfirmClicked
        answer = items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        currentSection = _.filter(items, (answer) ->
          answer.matrix_group is mGroup
        )
        trueSelected = @findSelectedItems(currentSection)
        if trueSelected
          _.forEach currentSection, (ansResult) ->
            if answer.id isnt ansResult.id
              ansResult.selected = false
            return
        if angular.isUndefined(answer.crossOut) or !answer.crossOut
          if !answer.selected
            answer.selected = true
            nexAction.addClass 'md-primary'
            seeAnswer.addClass 'hide'
          else
            answer.selected = false
            if !@findSelectedItems(items)
              nexAction.removeClass 'md-primary'
              seeAnswer.removeClass 'hide'

    selectTwoChoice : (isConfirmClicked, items, index, maxOpt) ->
      console.log maxOpt
      if !isConfirmClicked
        answer = items[index]
        nexAction = $('#nextAction')
        seeAnswer = $('#skipAction')
        if angular.isUndefined(answer.crossOut) or !answer.crossOut
          if !answer.selected
            ###validation which takes care to keep just 2 options selected###
            if maxOpt.length >= 2
              ansR = _.find(items, 'id': maxOpt[0])
              ansR.selected = false
              maxOpt = _.filter(maxOpt, (num, i) -> i isnt 0)

            maxOpt.push answer.id
            answer.selected = true
            nexAction.addClass 'md-primary'
            seeAnswer.addClass 'hide'
          else
            maxOpt = _.filter(maxOpt, (num) -> num isnt answer.id)
            answer.selected = false
            if !_.find(items, 'selected': true)
              nexAction.removeClass 'md-primary'
              seeAnswer.removeClass 'hide'

    crossOutChoice : (items, index, event) ->
      answer = items[index]
      answerCrossOut = if angular.isUndefined(answer.crossOut) or
       !answer.crossOut then true else false
      answer['crossOut'] = answerCrossOut
      answer['crossOutMsg'] = if answerCrossOut
      then 'Include this option' else 'Remove this option'
      @resetSelection items, index
      event.stopPropagation()


module.exports = questionTypeService
