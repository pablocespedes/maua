practiceUtilities = ($window, $q, $sce, utilities,
  practiceService, youtube, practiceConstants)->
  new class PracticeUtilities
    constructor: ->
    setQuestionTypeMatrixGroups : (items) ->
      console.log items
      _.forEach items, (answer, i) ->
        answer['matrix_group'] = (i - i % 3) / 3

      items = _.chunk items, 3


    removeBadImage : ->
      ###This function was added to solve the problem with the img on LSAT,
      #loaded from the content editor###
      angular.element('img').error ->
        angular.element('img').attr 'src', ''

    validateAnswer : (questionType, correctAnswers, selectedAnswers) ->
      isValid = false
      if questionType == 'MultipleChoiceOneOrMoreCorrect'
        isValid = if selectedAnswers.length > 0 then true else false
      else
        isValid = if correctAnswers.length == selectedAnswers.length
        then true else false
      isValid

    validateLayout : (questionObj) ->
      if angular.isDefined(questionObj.questionInformation) and
       questionObj.questionInformation != null and
       questionObj.questionInformation != '' then true else false

    setOneColumnLayout : (questionData) ->
      w = angular.element($window)

      getWidth = ->
        w.width()
      setWidth = =>
        if getWidth() <= 1360
          questionData.setLayoutOneColumn = false
        else
          questionData.setLayoutOneColumn =
           @validateLayout(questionData)

      setWidth()
      w.bind 'resize', ->
        setWidth()

    presentQuestion : (questionResponse) ->
      try
        resultObject = {}
        setLayoutType = null
        resultObject = questionResponse
        resultObject.fixedWidth = resultObject.question_set.fixed_info_width
        resultObject.questionInformation =
          $sce.trustAsHtml(resultObject.question_set.info)

        ###Find if there is a question info defined or retrieve it by the API###
        resultObject.setLayoutOneColumn =
          @validateLayout(resultObject)

        ###@Jose TODO This can be performed on a better way###
        angular.element('.choice.active').removeClass 'active'
        resultObject.items = []
        resultObject.stimulus = $sce.trustAsHtml(questionResponse.stimulus)
        optionList = practiceConstants.optionList
        options = optionList.toUpperCase().split('')
        answers = resultObject.answers
        len = if angular.isDefined(answers) then answers.length else 0
        i = undefined
        i = 0
        while i < len
          value = answers[i]
          value.body = $sce.trustAsHtml(value.body)
          value['option'] = options[i]
          value['selected'] = false
          #Default message for crossOut
          value['crossOutMsg'] = 'Remove this option'
          value['hasExplanation'] = !(value.explanation == null or
           angular.isUndefined(value.explanation) or value.explanation == '')
          value.explanation = $sce.trustAsHtml(value.explanation)
          resultObject.items.push value
          i++
        if resultObject.kind == 'MultipleChoiceMatrixTwoByThree' or
         resultObject.kind == 'MultipleChoiceMatrixThreeByThree'
          resultObject.items =
            @setQuestionTypeMatrixGroups(resultObject.items)
        @removeBadImage()
        return resultObject
      catch e

    confirmChoice : (questionResult, roundSessionAnswer, answers, questionType,
      groupId) ->
      answerStatus = true
      selectAnswers = []
      if questionType is 'MultipleChoiceMatrixThreeByThree' or
      questionType is 'MultipleChoiceMatrixTwoByThree'
        answers = [].concat.apply([], answers)


      correctAnswers = _.filter(answers, 'correct': true)
      selectedAnswers = _.filter(answers, 'selected': true)
      isValid = @validateAnswer(questionType,
        correctAnswers, selectedAnswers)
      if isValid
        _.forEach answers, (result) ->
          selectIdButton = '#' + result.id
          if result.correct
            if result.selected
              selectAnswers.push result.id
            else
              answerStatus = false
          else
            if result.selected
              selectAnswers.push result.id
              angular.element(selectIdButton).parents('#answer')
              .addClass 'incorrectAnswer'
              answerStatus = false

        if angular.isDefined(roundSessionAnswer) and
         angular.isDefined(selectAnswers) and selectAnswers.length >= 1
          practiceService.sendUserReponse roundSessionAnswer.id,
           selectAnswers, groupId, answerStatus
        angular.element('#answercontent *').prop 'disabled', true
        return answerStatus

    resetLayout : ->
      angular.element('#skipAction').addClass 'hide'
      angular.element('#nextAction').removeClass 'md-primary'
      angular.element('.list-group *').addClass 'no-hover'

    parseTagsAndResources : (tags) ->
      parsedTags = []
      parsedResources = []
      tgR = {}
      tagsLen = tags.length
      i = undefined
      j = undefined
      i = 0
      while i < tagsLen
        tagR = tags[i].tag_resources
        tagRLen = tagR.length
        currentTag = tags[i]
        if !_.find(parsedTags, ((tag) ->
          tag.name == currentTag.name))
          parsedTags.push currentTag
          j = 0
        while j < tagRLen
          currentTagResource = tagR[j]
          tgR =
            name: currentTag.name
            resource_type: currentTagResource.resource_type
            resource: if currentTagResource.resource_type is 'youtube'
            then utilities.getYoutubeVideosId(currentTagResource.resource)
            else currentTagResource.resource
          parsedResources.push tgR
          j++
        i++
      {
        tags: parsedTags
        resources: parsedResources
      }

    displayGeneralConfirmInfo : (questionResult) ->
      generalObject = {}
      generalObject.questionExplanation =
        $sce.trustAsHtml(questionResult.explanation)
      if generalObject.questionExplanation != null
        generalObject.showExplanation = true

      ###Evaluate tag resources info, get video Ids and video time###
      parsedTags = @parseTagsAndResources(questionResult.tags)
      generalObject.tagsResources = parsedTags.resources
      generalObject.tags = parsedTags.tags
      generalObject.xpTag = questionResult.experience_points
      generalObject

    getVideoExplanation : (questionResult) ->
      deferred = $q.defer()
      videoObject = {}

      ### video validation###
      if questionResult.youtube_video_id isnt null
        videoObject.showVideo = true
        videoObject.videoId = questionResult.youtube_video_id
        youtube.setYouTubeTitle(videoObject.videoId)
        .then (videoTime) ->
          videoObject.videoText = 'Video Explanation (' + videoTime + ')'
          deferred.resolve videoObject
      else
        deferred.resolve videoObject
      deferred.promise

    doNotKnowAnswer : (questionResult) ->
      resultObject = {}

      ###Question Explanation###
      resultObject.questionExplanation =
        $sce.trustAsHtml(questionResult.explanation)
      if resultObject.questionExplanation isnt null
        resultObject.showExplanation = true

      ###Get answers from the previous request and Explain###
      answers = questionResult.answers
      len = questionResult.answers.length
      i = undefined
      parsedTags = @parseTagsAndResources(questionResult.tags)
      resultObject.tagsResources = parsedTags.resources
      resultObject.tags = parsedTags.tags
      resultObject.xpTag = questionResult.experience_points
      angular.element('#answercontent *').prop 'disabled', true
      resultObject

    numericEntryConfirmChoice : (options) ->
      userAnswer = 0
      selectedAnswer = 0
      answerStatus = true
      answers = ''
      numerator = options.numerator
      denominator = options.denominator
      lastAnswerLoaded = options.lastAnswerLoaded
      questionResult = options.questionResult
      groupId = options.groupId
      roundSessionAnswer = options.roundSessionAnswer

      ###Get selected answers###
      if numerator or denominator
        if numerator > 0 and denominator > 0
          userAnswer = numerator + '/' + denominator
        else
          userAnswer = numerator
        answers = questionResult.answers
        len = answers.length
        answerFound = false
        i = undefined
        userAns = eval(userAnswer)
        selectedAnswer = []
        i = 0
        while i < len
          answer = answers[i]
          correctAns = eval(answer.body.valueOf())
          rang1 = if correctAns - 0.02 < 0 then 0 else correctAns - 0.02
          rang2 = correctAns + 0.02
          answerEval = answer.body.valueOf()is userAnswer or
           userAns >= rang1 and userAns <= rang2
          if answerEval and !answerFound
            answerFound = true
            ansId = if angular.isDefined(answer.answer_id)
            then answer.answer_id else answer.id
            selectedAnswer.push ansId
          answerStatus = answerEval
          i++

        ###if loop couldn't find a possible answer then array wont have data,
        then user data will be push to it###

        if selectedAnswer.length < 1
          selectedAnswer.push userAnswer
          answerStatus = false
        if angular.isDefined(roundSessionAnswer)
          practiceService.sendUserReponse roundSessionAnswer.id,
           selectedAnswer, groupId, answerStatus
        angular.element('#answercontent *').prop 'disabled', true
        return answerStatus

    setMailToInformation : (questionId, titleQuest) ->
      'Problem with ' + titleQuest + ' question #' + questionId

    usersRunOutQuestions : (trackTitle, activeGroupId) ->
      options =
        message: 'You\'ve answered all of the adaptive questions'+
        ' we have for you in ' + trackTitle + '.  ' + 'That\'s a lot'+
        ' of practice.  Would you like to review questions you\'ve answered'+
        'or go back to the main dashboard? '
        title: 'Congratulations!'
        buttons:
          review:
            label: 'Go to Review'
            className: 'btn-info'
            callback: ->
              utilities.redirect 'https://grockit.com/reviews'
          main:
            label: 'Go to Dashboard'
            className: 'md-primary'
            callback: ->
              utilities.internalRedirect '/' + activeGroupId + '/dashboard'
      utilities.dialogService options

    getAnswerType : (questionKind) ->
      template = ''
      switch questionKind
        when 'MultipleChoiceOneCorrect'
          template = 'one-choice/one-choice.html'
        when 'MultipleChoiceOneOrMoreCorrect'
          template = 'multiple-choice/multiple-choice.html'
        when 'MultipleChoiceMatrixTwoByThree'
          template = 'multiple-matrix2x3/multiple-matrix2x3.html'
        when 'MultipleChoiceMatrixThreeByThree'
          template = 'multiple-matrix3x3/multiple-matrix3x3.html'
        when 'NumericEntryFraction'
          template = 'fraction-entry/fraction-entry.html'
        when 'SPR'
          template = 'provisional-sat/provisional-sat.html'
        when 'NumericEntry'
          template = 'numeric-entry/numeric-entry.html'
        when 'sat'
          template = 'sat.html'
        when 'MultipleChoiceTwoCorrect'
          template = 'two-choice/two-choice.html'
      practiceConstants.questionTypesUrl + template

    setCurrentTrack : (groupId) ->
      deferred = $q.defer()
      trackData = utilities.getActiveTrack()
      if angular.isDefined(trackData.subject)
        deferred.resolve trackData
      else
        practiceService.getRandomTrack(groupId).then (response) ->
          tracks = response.data.dashboard.smart_practice.items
          index = _.random(0, tracks.length - 1)
          currentTrack = tracks[index]
          utilities.setActiveTrack currentTrack, currentTrack.id
          deferred.resolve utilities.getActiveTrack()
      deferred.promise

    showQuestionError : (questionKind) ->
      message = ''
      switch questionKind
        when 'MultipleChoiceOneCorrect', 'MultipleChoiceOneOrMoreCorrect'
          message = 'Please select an option!'
        when'MultipleChoiceMatrixTwoByThree','MultipleChoiceMatrixThreeByThree'
          message = 'Please select at least one option of each section!'
        when 'MultipleChoiceTwoCorrect'
          message = 'Please select at least two options!'
        else
          message = 'Required'
          break
      message

 practiceUtilities.$inject = ['$window', '$q', '$sce', 'utilities',
  'practiceService', 'youtube', 'practiceConstants']
module.exports = practiceUtilities