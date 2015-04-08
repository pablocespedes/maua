history = ($q,$sce,dateUtils,resource,utilities)->
  new class HistoryService extends resource
    constructor: () ->
      super()
      @containerList = []
      @currentPage=1

    parseQuestionsData : (roundSessions) ->
      questionsWithDay = _.map(roundSessions, (question) ->
        date = new Date(question.created_at)

        question.question_stimulus=
          utilities.htmlToPlaintext(question.question_stimulus)

        question.day = dateUtils.getStandardDate(date)
        if question.created_at and question.answered_at
          question.time_to_answer =
          dateUtils.secondsBetweenDates(question.created_at,
            question.answered_at)
        question
      )
      grouppedByDay = _.groupBy(questionsWithDay, 'day')
      parsedQuestions = _.map(_.keys(grouppedByDay), (key) ->
        {
          day: key
          roundSessions: grouppedByDay[key]
        }
      )
      parsedQuestions

    loadQuestions : (groupId) ->
      deferred = $q.defer()
      optionals = 'page':@currentPage++
      @customGet(groupId,'round_sessions', optionals).then (historyResponse) =>
        @containerList =
          _.union(@containerList, historyResponse.data.round_sessions)
        parsedQuestions = @parseQuestionsData(@containerList)
        deferred.resolve parsedQuestions
      deferred.promise

    reset : ->
      @containerList = []
      @currentPage = 1
      return

history.$inject = ['$q','$sce','dateUtils','resource','utilities']
module.exports = history
