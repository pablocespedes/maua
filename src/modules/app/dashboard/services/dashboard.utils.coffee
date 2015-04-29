
dashboardService = ($q,resource)->
  new class DashboardService extends resource

    _getScore: (track) ->
      if @dashboardData.score_prediction
      then @dashboardData.score_prediction.tracks[track.id] else null

    constructor: ->
      super()
      @dashboardData = null

    getDashboard :(groupId) ->
      @show(groupId,'dashboard')

    setDashboardData : (groupId) ->
      deferred = $q.defer()
      @getDashboard(groupId).then (result) =>
        @dashboardData = null
        @dashboardData = @appendBlogInfo(result.data.dashboard)
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
      smartPracticeItems =
      _.forEach(trackArray, (result) =>
        subtracksStr = ''
        subCount = result.items.length
        result['getScore'] = @_getScore(result)
        result['hasScore'] = @_getScore(result) != null and
         @_getScore(result) > 0

        subtracks = _.forEach(result.items, (subtrack,index) ->
          accuracy = (subtrack.total_questions_answered_correctly /
            (subtrack.total_questions_answered * 100))
          subtrack['accuracy'] = if accuracy > 0
          then Math.round(accuracy.toFixed(2)) else 0
          console.log  index

          subtracksStr += if subCount <= 1 or subCount is (index+1)
          then subtrack.name else subtrack.name.concat(', ')


        )
        result['subtracksStr'] = subtracksStr.substring(0, 85).concat('...')
      )
      @dashboardData.smart_practice.items = smartPracticeItems
      console.log @dashboardData.smart_practice.items
      @dashboardData.smart_practice

    getChallenge : ->
      @dashboardData.challenge

    hasQuestionsAnswered : ->
      @dashboardData.progress.all.total_questions_answered >= 1

    appendBlogInfo :(data)->
      info = [
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2014/10/canstockphoto8251999-800x321.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-arithmetic/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2015/01/canstockphoto159045311-495x400.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-algebra/',
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2011/09/canstockphoto9473671-495x400.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-geometry/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2012/03/canstockphoto9440015-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-data-analysis-interpretation/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2014/03/canstockphoto8742483-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-formulas-inequalities-absolute-value/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2012/04/canstockphoto4871175-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-reading-comprehension'
        },
        {
            'img': 'http://grockit.com/blog/wp-content/uploads/2012/05/canstockphoto3339507-800x321.jpg'
            'link': 'http://grockit.com/blog/gre-study-guide-text-completion/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2014/10/canstockphoto8251999-800x321.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-arithmetic/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2015/01/canstockphoto159045311-495x400.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-algebra/',
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2011/09/canstockphoto9473671-495x400.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-geometry/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2012/03/canstockphoto9440015-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-data-analysis-interpretation/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2014/03/canstockphoto8742483-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-formulas-inequalities-absolute-value/'
        },
        {
          'img': 'http://grockit.com/blog/wp-content/uploads/2012/04/canstockphoto4871175-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-reading-comprehension'
        },
        {
            'img': 'http://grockit.com/blog/wp-content/uploads/2012/05/canstockphoto3339507-800x321.jpg'
            'link': 'http://grockit.com/blog/gre-study-guide-text-completion/'
        },
        {
            'img': 'http://grockit.com/blog/wp-content/uploads/2012/02/canstockphoto0422182-800x321.jpg'
            'link': 'http://grockit.com/blog/gre-study-guide-sentence-equivalence/'
          }]
      _.forEach data.smart_practice.items, (item,index)->
          console.log item
          item['img'] = info[index].img
          item['link'] = info[index].link

      return data


dashboardService.$inject = ['$q','resource']
module.exports = dashboardService