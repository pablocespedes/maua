'use strict'
class QuestionController
  # Services injected into the controller constructor
  constructor: ($scope,@product,@practiceService,
    @utilities,@splashMessages,@practiceUtilities)->
    questionObserver = null
    @questionData = {}
    @isbuttonClicked = false
    @maxOpts = []
    @explanationInfo = {}
    @videoInfo = {}
    @portalC = @
    @loading = true
    @nextActionTitle = 'Confirm Choice'
    @answerStatus = null
    @explanationInfo.showExplanation = false
    @videoInfo.showVideo = false
    @loadingMessage = @splashMessages.getLoadingMessage()
    @init()
    $scope.$on '$destroy', ->
      $scope.vmPr.product.unregisterGroup $scope.vmPr.questionObserver


  init : ->
    questionObserver = currentProduct.observeGroupId().register((groupId) ->
      if @activeGroupId != groupId
        @activeGroupId = groupId

        questionId = utilities.getCurrentParam('questionId')
        if angular.isDefined(questionId)
          @getQuestion questionId

      return
    )
    return

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
    @practiceUtilities.getVideoExplanation(@questionData).then (videoInfo) ->
      @videoInfo = videoInfo

  displayExplanationInfo: ->
    generalInfo = @practiceUtilities.displayGeneralConfirmInfo(@questionData)
    @bindExplanationInfo generalInfo
    @bindVideoExplanationInfo @questionData

  confirmAnswer: ->
    @answerStatus = @practiceUtilities.confirmChoice(@questionData,
      undefined, @items, @questionData.kind, @activeGroupId)
    if angular.isDefined(@answerStatus)
      @resetLayout()
      @questionData.setLayoutOneColumn = true
      @displayExplanationInfo()
      @isbuttonClicked = true

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
  numericConfirmAnswer: ->
    options = {}
    options.numerator = @numerator
    options.denominator = @denominator
    options.lastAnswerLoaded = @questionData.kind
    options.questionResult = @questionData
    options.roundSessionAnswer = undefined
    options.groupId = @activeGroupId
    @answerStatus = @practiceUtilities.numericEntryConfirmChoice(options)
    if angular.isDefined(@answerStatus)
      @resetLayout()
      @questionData.setLayoutOneColumn = true
      @displayExplanationInfo()
      @isbuttonClicked = true
    return

QuestionController.$inject = ['$scope','product','practiceService',
'utilities','splashMessages','practiceUtilities']

module.exports = QuestionController
