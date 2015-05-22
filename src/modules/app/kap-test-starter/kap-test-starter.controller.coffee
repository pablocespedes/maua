class KapTestController
  # Services injected into the controller constructor
  constructor: (@product, @practiceService,@utilities,
    @practiceUtilities,$mdDialog,@alert) ->
    @mdDialog = $mdDialog
    @isbuttonClicked = false
    @maxOpts = []
    @explanationInfo = {}
    @videoInfo = {}
    @explanationInfo.showExplanation = false
    @videoInfo.showVideo = false
    @portalC = @
    @loading = true
    @nextActionTitle = 'Confirm Choice'
    @answerStatus = null
    @isValid = true
    @invalidMessage = ''
    @Error = false
    @isDisabled = false
    @init()

  init : ->
    @activeGroupId = 'gre'
    @setCurrentTrack @activeGroupId

  nextAction : ->
    if @nextActionTitle == 'Confirm Choice'
      @isDisabled = true
      @evaluateConfirmMethod()
    else
      @isValid = true
      @invalidMessage = ''
      @nextQuestion()

  revealExplanation : ->
    @doNotKnowAnswer()


  getNewPracticeGame : (apiUrl) ->
    @practiceService.createNewGame(apiUrl).then (game) =>
      if angular.isDefined(game) and game != null
        @getQuestions()
    .catch @handleError

  getQuestions : ->
    @practiceService.setQuestionsData(@activeGroupId,
      @activeTrack.subject.id, @activeTrack.subject.type).then (response) =>
      if response
        @presentQuestion()
      else
        @practiceUtilities.usersRunOutQuestions @activeTrack.subject.name,
         @activeGroupId
    .catch @handleError

  presentQuestion : ->
    requestLocalData = @practiceService.getQuestionData()
    if requestLocalData != null
      questionData = @practiceUtilities.presentQuestion(requestLocalData)
      if angular.isDefined(questionData)
        @practiceService.getRoundSession(questionData.id, @activeGroupId)
        .then (result) =>
          @roundSessionAnswer = result
        .catch @handleError

        @questionData = questionData
        @practiceUtilities.setOneColumnLayout @questionData
        @answerType = @practiceUtilities.getAnswerType(questionData.kind)
        @items = []
        @maxOpts = []
        @items = questionData.items
        @loading = false
        @feedbackInfo questionData.id

    else
      @loading = true
      @getQuestions()

  displayExplanationInfo : ->
    generalInfo = @practiceUtilities.displayGeneralConfirmInfo(@questionData)
    @bindExplanationInfo generalInfo
    @bindVideoExplanationInfo @questionData

  bindExplanationInfo : (info) ->
    @explanationInfo = info
    @nextActionTitle = 'Next Question'
    @isDisabled = false

  bindVideoExplanationInfo : ->
    @practiceUtilities.getVideoExplanation(@questionData).then (videoInfo) =>
      @videoInfo = videoInfo
    .catch @handleError

  doNotKnowAnswer : ->
    @userConfirmed = false
    generalResult = @practiceUtilities.doNotKnowAnswer(@questionData)
    @bindVideoExplanationInfo @questionData
    if angular.isDefined(generalResult)
      @resetLayout()
      @questionData.setLayoutOneColumn = true
      @bindExplanationInfo generalResult
      @isbuttonClicked = true
      @isValid = true
      @invalidMessage = ''
    else
      @isDisabled = false

  evaluateConfirmMethod : ->
    @userConfirmed = true
    switch @questionData.kind
      when 'SPR', 'NumericEntry', 'NumericEntryFraction'
        @numericConfirmAnswer()
      else
        @confirmAnswer()

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

  feedbackInfo : (questionId) ->
    @subjectMail = @practiceUtilities.setMailToInformation(questionId,
     @activeTrack.subject.name)

  nextQuestion : ->
    @presentQuestion()
    @isbuttonClicked = false
    @numerator = null
    @denominator = null
    angular.element('#answercontent *')
    .removeClass('btn-primary btn-danger btn-success').removeAttr 'disabled'
    @videoInfo.showVideo = false
    @explanationInfo.showExplanation = false
    @answerStatus = null
    @nextActionTitle = 'Confirm Choice'
    @messageConfirmation = ''
    angular.element('#skipAction').removeClass 'hide'
    angular.element('#nextAction').removeClass 'md-primary'
    return

  confirmAnswer : ->
    @answerStatus = @practiceUtilities.confirmChoice(@questionData,
     @roundSessionAnswer, @items, @questionData.kind, @activeGroupId)
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

  resetLayout : ->
    @nextActionTitle = 'Next Question'
    @practiceUtilities.resetLayout()

  setCurrentTrack : (groupId) ->
    @practiceUtilities.setCurrentTrack(groupId).then (response) =>
      if response
        @activeTrack = response
        @getNewPracticeGame @activeTrack.subject.url
    .catch @handleError

  handleError:(e)=>
    @loading = false
    @Error = true
    console.log e

KapTestController.$inject = ['product','practiceService','utilities',
'practiceUtilities','$mdDialog','alert']

module.exports = KapTestController