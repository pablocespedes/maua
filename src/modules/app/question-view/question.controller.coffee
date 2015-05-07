'use strict'
class QuestionController
  # Services injected into the controller constructor
  constructor: ($scope,@product,@practiceService,
    @utilities,@splashMessages,@practiceUtilities)->
    @questionData = {}
    @isbuttonClicked = false
    @maxOpts = []
    @explanationInfo = {}
    @videoInfo = {}
    @isValid = true
    @portalC = @
    @loading = true
    @nextActionTitle = 'Confirm Choice'
    @answerStatus = null
    @explanationInfo.showExplanation = false
    @videoInfo.showVideo = false
    @loadingMessage = @splashMessages.getLoadingMessage()
    @init()

  init : ->
    questionId = @utilities.getCurrentParam('questionId')
    if angular.isDefined(questionId)
      @getQuestion questionId

  getQuestion: (questionId) ->
    @practiceService.getQuestionFromApi(questionId).then (questionResponse) =>
      if angular.isDefined(questionResponse)
        @practiceService.setQuestionData questionResponse
        @presentQuestion()

  presentQuestion: ->
    questionData =
      @practiceUtilities.presentQuestion(@practiceService.getQuestionData())
    if angular.isDefined(questionData)
      @questionData = questionData
      @practiceUtilities.setOneColumnLayout @questionData
      @answerType = @practiceUtilities.getAnswerType(questionData.kind)
      @items = []
      @maxOpts = []
      @items = questionData.items
      @loading = false

    return

  bindExplanationInfo: (info) ->
    @explanationInfo = info

  bindVideoExplanationInfo: ->
    @practiceUtilities.getVideoExplanation(@questionData).then (videoInfo) =>
      @videoInfo = videoInfo

  displayExplanationInfo: ->
    generalInfo = @practiceUtilities.displayGeneralConfirmInfo(@questionData)
    @bindExplanationInfo generalInfo
    @bindVideoExplanationInfo @questionData

  confirmAnswer : ->
    @answerStatus = @practiceUtilities.confirmChoice(@questionData,
     undefined, @items, @questionData.kind, @activeGroupId)
    if angular.isDefined(@answerStatus)
      @resetLayout()
      @questionData.setLayoutOneColumn = true
      @displayExplanationInfo()
      @isbuttonClicked = true
      @isValid = true
      @invalidMessage = ''
    else
      @isDisabled = false
      @isValid = false
      @invalidMessage = @practiceUtilities.showQuestionError(@questionData.kind)

  resetLayout: ->
    angular.element('#nextAction').addClass 'hide'
    @practiceUtilities.resetLayout()

  evaluateConfirmMethod: ->
    @userConfirmed = true
    switch @questionData.kind
      when 'SPR', 'NumericEntry', 'NumericEntryFraction'
        @numericConfirmAnswer()
      else
        @confirmAnswer()
    return

  numericConfirmAnswer : ->
    options = {}
    options.numerator = @numerator
    options.denominator = @denominator
    options.lastAnswerLoaded = @questionData.kind
    options.questionResult = @questionData
    options.roundSessionAnswer = @roundSessionAnswer
    options.groupId = @activeGroupId
    @answerStatus = @practiceUtilities.numericEntryConfirmChoice(options)
    if angular.isDefined(@answerStatus)
      @questionData.setLayoutOneColumn = true
      @resetLayout()
      @displayExplanationInfo()
      @isbuttonClicked = true
      @isValid = true
      @invalidMessage = ''
    else
      @isDisabled = false
      @isValid = false
      @invalidMessage = @practiceUtilities.showQuestionError(@questionData.kind)

  nextAction:->
    if @nextActionTitle == 'Confirm Choice'
      @evaluateConfirmMethod()



QuestionController.$inject = ['$scope','product','practiceService',
'utilities','splashMessages','practiceUtilities']

module.exports = QuestionController
