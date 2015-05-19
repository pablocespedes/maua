Storage =require('../../application/services/_storage')

dashboardService = ($q,resource,utilities)->
  new class DashboardService extends Storage

    #allows multiple classes to be extend
    _.extend @::, resource::, Storage::

    _getScore: (track) ->
      if @dashboardData.score_prediction
      then @dashboardData.score_prediction.tracks[track.id] else null

    constructor: ->
      super()
      @dashboardData = null
      @groupId = null

    getDashboard :(groupId) ->
      @show(groupId,'dashboard')

    setDashboardData : (groupId) ->
      deferred = $q.defer()
      @groupId = groupId
      @getDashboard(groupId).then (result) =>
        @dashboardData = null
        @dashboardData = result.data.dashboard
        deferred.resolve true
      deferred.promise

    getScorePrediction : ->
      scoreData = {}
      scoreResponse = @dashboardData.score_prediction

      scoreData.tracks = scoreResponse.tracks
      scoreData.totalScore = if scoreResponse.total_score != null
      then scoreResponse.total_score else 0

      scoreData.incomplete = scoreResponse.incomplete
      if scoreResponse.range != null and !_.isEmpty(scoreResponse.range)
        scoreData.rangeExist = true

      history

    getSmartPractice : ->
      accuracy = null
      subtracks = null
      currentCard = {}
      #cardsOrder = @get('cards_'+@groupId)
      trackArray = @dashboardData.smart_practice.items
      smartPracticeItems = null
      cardCssCopy = @getAvailableCss()
      cardsCssCount = cardCssCopy.length-1
      smartPracticeItems =
      _.forEach trackArray, (result,index) =>
        subtracksStr = ''
        subCount = result.items.length
        # if utilities.existy cardsOrder
        #   currentCard = @getStoredCard(cardsOrder,result.id)
        # else
        #   currentCard.position = index
        #   currentCard.favorite = false

        result.position = index#currentCard.position
        #result.favorite = currentCard.favorite
        result.getScore = @_getScore(result)
        result.hasScore = @_getScore(result) != null and
         @_getScore(result) > 0

        subtracks = _.forEach result.items, (subtrack,index) ->
          accuracy = (subtrack.total_questions_answered_correctly /
            (subtrack.total_questions_answered * 100))
          subtrack['accuracy'] = if accuracy > 0
          then Math.round(accuracy.toFixed(2)) else 0

          subtracksStr += if subCount <= 1 or subCount is (index+1)
          then subtrack.name else subtrack.name.concat(', ')
        result.subtracksStr = subtracksStr.substring(0, 100).concat('...')

        if index <= cardsCssCount
          @getCardCss(result,cardCssCopy,index)
        else
          @getRandCss(result,cardCssCopy)


      @dashboardData.smart_practice.items = smartPracticeItems
      @dashboardData.smart_practice

    getChallenge : ->
      @dashboardData.challenge

    hasQuestionsAnswered : ->
      @dashboardData.progress.all.total_questions_answered >= 1

    getAvailableCss:()->
      clasess = [
                 'card-purple'
                 'card-red-light',
                 'card-teal',
                 'card-green',
                 'card-grey',
                 'card-blue-grey',
                 'card-indigo',
                 'card-amber',
                 'card-red',
                 'card-light-cyan',
                 'card-blue',
                 'card-light-green'
                 'card-yellow',
                 'card-lime']
      clasess.slice()

    getCardCss:(item, clasessCopy, index)->
      item.cardCss = clasessCopy[index]

    getRandCss:(item, clasessCopy)->
      clsLenght = clasessCopy.length-1
      if clsLenght isnt 0
        randN = _.random clsLenght
        currentCss = clasessCopy[randN]
        item.cardCss = currentCss
        _.pull clasessCopy, currentCss
      else
        @getRandCss(item,@getAvailableCss())

    getStoredCard:(cardsOrder,trackId)->
      search = _.find cardsOrder, (item) ->
        item.id is trackId
      search

    saveCardPosition:(tracks)->
      cards = _.map tracks, (item)->
        {'position': item.position, 'id':item.id, 'favorite': item.favorite }
      @save('cards_'+@groupId,cards)




dashboardService.$inject = ['$q','resource','utilities']
module.exports = dashboardService