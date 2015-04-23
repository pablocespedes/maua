practiceService = ($q,$resource,resource,urlsCons,dashboardService)->
  new class PracticeService extends resource
    constructor: ->
      super()
      questionsData = null
      position = 0
      gameId = null

    createNewPracticeGame : (url) ->
      if url.split(/^\//).length > 0
        url = url.split(/^\//)[1]
      @singleBase(url).post()

    createNewGameSubtrack : (groupId, subTrackId) ->
      @singleBaseId(groupId,'subtracks').one(subTrackId).post 'practice'

    ###Round Sessions###
    createQuestionPresentation : (gameId, questionId, groupId) ->
      @singleBaseId(groupId,'round_sessions').post '', '',
        game_id: gameId
        question_id: questionId

    updateAnswer : (roundSessionAnswerId, answers, gameId, groupId) ->
      @singleBaseId(groupId,'round_sessions').one roundSessionAnswerId
    #return Restangular.one(groupId,'round_sessions')
    #.one(roundSessionAnswerId).put();

    ###questions###
    getQuestionById : (questionId) ->
      @singleBase('questions').one(questionId).customGET ''

    ###subject means a possible trackId or subtrackId###
    getQuestions : (groupId, subjectId, type) ->
      subjectType = if type == 'Track' then 'tracks' else 'subtracks'
      @singleBase(groupId).one(subjectType, subjectId).customGET 'questions'

    setQuestionsData : (groupId, subjectId, type) ->
      deferred = $q.defer()
      @getQuestions(groupId, subjectId, type).then (result) =>
        @questionsData = null
        questData = result.data.questions
        if questData.length > 0
          @setQuestionData questData
          deferred.resolve true
        else
          deferred.resolve false

      deferred.promise

    setQuestionData : (questionResponse) ->
      @position = 0
      @questionsData = null
      @questionsData = questionResponse

    getQuestionData : ->
      questionCount = @questionsData.length
      if @position < questionCount
        questionResult = @questionsData[@position]
        questionResult['questPosition'] = ''
        @position++
        questionResult
      else
        @position = 0
        null

    getRoundSession : (questionToRequest, groupId) ->
      @createQuestionPresentation(@gameId, questionToRequest, groupId)
      .then((response) ->
        response.data.round_session
      ).catch (e) ->
        alerts.showAlert alerts.setErrorApiMsg(e), 'danger'

    getQuestionFromApi: (questionId) ->
      @getQuestionById(questionId).then((result) ->
        questionCollection = []
        questionCollection.push result.data.question
        questionCollection
      ).catch (e) ->
        alerts.showAlert alerts.setErrorApiMsg(e), 'danger'

    createNewGame: (url) ->
      @createNewPracticeGame(url).then((game) =>
        @gameId = null
        @gameId = game.data.practice_game.id
        @gameId
      ).catch (e) ->
        alerts.showAlert alerts.setErrorApiMsg(e), 'danger'

    getTimingInformation : (trackId, groupId, questionId) ->
      url = urlsCons.timingData + groupId + '/' + trackId + '/'+
      questionId + '.json'
      $resource(url).query array: true

    sendUserReponse: (roundSessionAnswerId, answers, groupId, answerStatus) ->
      update = @updateAnswer(roundSessionAnswerId, answers, @gameId, groupId)
      update.answers = answers
      update.correct = answerStatus
      update.put game_id: @gameId

    getRandomTrack : (groupId) ->
      dashboardService.getDashboard groupId


practiceService.$inject = ['$q','$resource','resource','urlsCons',
'dashboardService']
module.exports = practiceService