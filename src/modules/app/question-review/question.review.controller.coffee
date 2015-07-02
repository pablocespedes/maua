'use strict'

class ReviewController
  # Services injected into the controller constructor
  constructor: ($scope, @practiceUtilities, @product, @practiceService,
   @reviewService, @utilities, @dateUtils) ->
    @reviewObserver = null
    @explanationInfo = {}
    @videoInfo = {}
    @portalC = @
    @loading = true
    @answerStatus = null
    @explanationInfo.showExplanation = true
    @videoInfo.showVideo = false
    @init()

  init : ->
    reviewObserver = @product.observeGroupId().register((groupId) =>
      if @activeGroupId isnt groupId
        @activeGroupId = groupId
        @questionAnalytics = @activeGroupId is 'gmat' or
         @activeGroupId is 'act' or @activeGroupId is 'sat' or
          @activeGroupId is 'gre'
        roundSessionId = @utilities.getCurrentParam('rounSessionId')
        if angular.isDefined(roundSessionId)
          @getRounSessionData @activeGroupId, roundSessionId
      return
    )
    return

  getRounSessionData : (grouId, roundSessionId) ->
    @reviewService.getRoundSession(grouId, roundSessionId).then((response) =>
      roundResponse = response.data.round_session
      @answerStatus = if roundResponse.outcome is'correct'
      then true else false
      @trackId = roundResponse.track_id
      @userConfirmed = !(roundResponse.outcome isnt 'correct' and
       roundResponse.outcome != 'incorrect')
      @timeToAnswer = @dateUtils.secondsBetweenDates(
        roundResponse.created_at, roundResponse.answered_at)
      @asnwerId = roundResponse.answer_id
      @getQuestion roundResponse.question_id
    ).catch (e) ->

  getQuestion : (questionId) ->
    @practiceService.getQuestionFromApi(questionId).then (questionResponse) =>
      if angular.isDefined(questionResponse)
        @practiceService.setQuestionData questionResponse
        @presentQuestion()

  presentQuestion : ->
    questionData = @practiceUtilities
    .presentQuestion(@practiceService.getQuestionData())
    if angular.isDefined(questionData)
      @questionData = questionData
      @answerType = @practiceUtilities.getAnswerType(questionData.kind)
      @items = []
      @items = questionData.items
      entry = _.find(@items, 'id': @asnwerId)
      if angular.isDefined(entry)
        if questionData.kind is 'NumericEntry' or
         questionData.kind is 'NumericEntryFraction'
          parts = entry.body.toString().split('/')
          if parts.length > 1
            @numerator = parts[0]
            @denominator = parts[1]
          else
            @numerator = entry.body
        else
          entry.selected = true
      @loading = false
      if @questionAnalytics
        @setTimingInformation questionData.id, questionData.kind
      @displayExplanationInfo()
      angular.element('#solutionarea').addClass 'hide-input'

  displayExplanationInfo : ->
    generalInfo =@practiceUtilities.displayGeneralConfirmInfo(@questionData)
    @explanationInfo = generalInfo
    @practiceUtilities.getVideoExplanation(@questionData).then (videoInfo) =>
      @videoInfo = videoInfo

  setTimingInformation : (questionId, correctAnswerId, kind) ->
    @practiceService.getTimingInformation(@trackId,
     @activeGroupId, questionId).$promise.then((result) =>
      timingData = result[0]
      #@showTiming = true
      @timingData = timingData
      @totalAnswered = timingData.total_answered
      mergedList = _.map(@items, (item) ->
        _.extend item, _.findWhere(result[0].answers, 'answer_id': item.id)
      )
      percentAnswered = timingData.total_answered_correctly /
      (timingData.total_answered * 100)
      @percentAnswered = if percentAnswered > 0
      then Math.round(percentAnswered.toFixed(2)) else 0
      @isbuttonClicked = true

    ).catch (e) ->
      #@showTiming = false

ReviewController.$inject = ['$scope', 'practiceUtilities', 'product',
 'practiceService', 'reviewService', 'utilities', 'dateUtils']

module.exports = ReviewController
