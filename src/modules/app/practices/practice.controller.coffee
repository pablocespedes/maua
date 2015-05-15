'use strict'
class PracticeController
  # Services injected into the controller constructor
  constructor: ($scope,$timeout,@product, @practiceService,@utilities,
  @splashMessages,@timer,@practiceUtilities,@questionTiming,$mdDialog,@alert) ->
    @timeout = $timeout
    @mdDialog = $mdDialog
    @practiceObserver = null
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
    @time = 0
    @Error = false
    if @isUserSettingAvailable()
      @time = @timeObj.minutes * 60
    @loadingMessage = @splashMessages.getLoadingMessage()
    @isDisabled = false
    @init()
    #Takes care to unregister the group once the user leaves the controller
    $scope.$on '$destroy', ->
      $scope.vmPr.product.unregisterGroup $scope.vmPr.practiceObserver
      $scope.vmPr.timer.destroy $scope.vmPr.practiceTimer
      $scope.vmPr.timer.destroy $scope.vmPr.questionTimer

  init : ->
    @practiceObserver = @product.observeGroupId().register (groupId) =>
      if @activeGroupId isnt groupId
        @activeGroupId = groupId
        @setCurrentTrack groupId
        @questionAnalytics = @activeGroupId is 'gmat' or
         @activeGroupId is 'act' or @activeGroupId is 'sat' or
          @activeGroupId is 'gre'

  nextAction : ->
    @pauseTimers()
    if @nextActionTitle == 'Confirm Choice'
      @isDisabled = true
      @evaluateConfirmMethod()
    else
      @isValid = true
      @invalidMessage = ''
      @nextQuestion()

  revealExplanation : ->
    @pauseTimers()
    @doNotKnowAnswer()

  setTimingInformation : (questionId, kind) ->
    @practiceService.getTimingInformation(@activeTrack.trackId,
      @activeGroupId,questionId).$promise.then (result) =>
      if angular.isDefined(result)
        timingData = result[0]
        @showTiming = true
        @timingData = timingData
        @totalAnswered = timingData.total_answered
        mergedList = _.map(@items, (item) ->
          _.extend item, _.findWhere(timingData.answers, 'answer_id': item.id)
        )
        percentAnswered = timingData.total_answered_correctly /
         timingData.total_answered * 100
        @percentAnswered =
          if percentAnswered > 0 then Math.round(percentAnswered.toFixed(2))
          else 0
    .catch (e) =>

  initPracticeTimer: ->
    @practiceTimer = @timer.create()

  initQuestionTimer: ->
    @questionTimer = @timer.create()

  resetQuestionTimer: ->
    @questionTimer.reset()
    if @isUserSettingAvailable()
      @time = @timeObj.minutes * 60

    @questionTimer.start(@time)
    if @shouldEnableQuestionTime()
      @questionTimer.interval.then null, null, (val) =>
        if @time == (val + 1)
          alert = @mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Time\'s Up')
            .content('Review question solution!')
            .ariaLabel('Review question solution')
            .ok('Got it!')
          @revealExplanation()
          @mdDialog.show(alert).then ->
            alert = undefined
            return
      return
    @restartPracticeTimer()

  restartPracticeTimer: ->
    @practiceTimer.start()

  pauseTimers : ->
    @practiceTimer.pause()
    @questionTimer.pause()
  shouldEnableQuestionTime : ->
    @time > 0

  getNewPracticeGame : (apiUrl) ->
    @practiceService.createNewGame(apiUrl).then (game) =>
      if angular.isDefined(game) and game != null
        @getQuestions()
        @initPracticeTimer()
        @initQuestionTimer()
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
        .catch (e) =>
          @handleError 'Sorry something retrieving your question information'

        @questionData = questionData
        @practiceUtilities.setOneColumnLayout @questionData
        @answerType = @practiceUtilities.getAnswerType(questionData.kind)
        @items = []
        @maxOpts = []
        @items = questionData.items
        @loading = false
        @resetQuestionTimer()
        @feedbackInfo questionData.id
        if @questionAnalytics
          @setTimingInformation questionData.id, questionData.kind
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
    @timeout (=>
      @isDisabled = false
    ), 200

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
    angular.element('#nextAction').removeClass 'btn-primary'
    angular.element('#PanelQuestion').addClass('fadeIn animated')
    .one 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd'+
    ' animationend animationend', ->
      angular.element(this).removeClass()
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

  isUserSettingAvailable : ->
    @timeObj = @questionTiming.getTime()
    if @utilities.truthy(@timeObj)
      return true
    false

  handleError:(e)=>
    @loading = false
    @Error = true
    console.log e


PracticeController.$inject = ['$scope','$timeout','product','practiceService',
'utilities','splashMessages','timer','practiceUtilities','questionTiming',
'$mdDialog','alert']

module.exports = PracticeController
