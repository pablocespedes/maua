Storage =require('../../application/services/_storage')

dashboardService = ($q,resource)->
  new class DashboardService

    #allows multiple classes to be extend
    _.extend @::, resource::, Storage::

    _getScore: (track) ->
      if @dashboardData.score_prediction
      then @dashboardData.score_prediction.tracks[track.id] else null

    constructor: ->
      @dashboardData = null

    getDashboard :(groupId) ->
      @show(groupId,'dashboard')

    setDashboardData : (groupId) ->
      deferred = $q.defer()
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
      trackArray = @dashboardData.smart_practice.items
      smartPracticeItems = null
      cardCssCopy = @getAvailableCss()

      smartPracticeItems =
      _.forEach trackArray, (result,index) =>
        subtracksStr = ''
        subCount = result.items.length
        result.position = index
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

        #set random card color
        @getRandCss(result,cardCssCopy)

      @dashboardData.smart_practice.items = smartPracticeItems
      @dashboardData.smart_practice

    getChallenge : ->
      @dashboardData.challenge

    hasQuestionsAnswered : ->
      @dashboardData.progress.all.total_questions_answered >= 1

    getAvailableCss:()->
      clasess = ['card-pink',
                 'card-teal',
                 'card-amber',
                 'card-green',
                 'card-indigo',
                 'card-grey',
                 'card-red',
                 'card-light-cyan',
                 'card-blue',
                 'card-blue-grey',
                 'card-light-green'
                 'card-yellow',
                 'card-lime',
                 'card-purple']
      clasess.slice()

    getRandCss:(item, clasessCopy)->
      clsLenght = clasessCopy.length-1
      if clsLenght isnt 0
        randN = _.random clsLenght
        currentCss = clasessCopy[randN]
        item.cardCss = currentCss
        _.pull clasessCopy, currentCss
      else
        @getRandCss(item,@getAvailableCss())

    # appendAttrs:(data)->
    #   clasessCopy = @getAvailableCss()
    #   _.forEach data.smart_practice.items, (item,index)=>
    #     @randomizeTracks(item,clasessCopy)
    #   return data

    hidPaymentBanner:->

    showPaymentBanner:->

    saveCardPosition:->




dashboardService.$inject = ['$q','resource']
module.exports = dashboardService