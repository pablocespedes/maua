
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
      smartPracticeItems = null
      smartPracticeItems =
      _.forEach(@dashboardData.smart_practice.items, (result) =>
        result['getScore'] = @_getScore(result)
        result['hasScore'] = @_getScore(result) != null and
         @_getScore(result) > 0

        subtracks = _.forEach(result.items, (subtrack) ->
          accuracy = (subtrack.total_questions_answered_correctly /
            (subtrack.total_questions_answered * 100))
          subtrack['accuracy'] = if accuracy > 0
          then Math.round(accuracy.toFixed(2)) else 0
        )
      )
      @dashboardData.smart_practice.items = smartPracticeItems
      @dashboardData.smart_practice

    getChallenge : ->
      @dashboardData.challenge

    hasQuestionsAnswered : ->
      @dashboardData.progress.all.total_questions_answered >= 1

    appendBlogInfo :(data)->
      console.log data,'asdas'
      info = [
        {
          'id': 'baebea04-ed61-9dd9-dca2-d389f495722',
          'textInf': 'The GRE involve Arithmetic to some extent. Among the most important topics are number properties, ratios, and percents.',
          'img': 'http://grockit.com/blog/wp-content/uploads/2014/10/canstockphoto8251999-800x321.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-arithmetic/'
        },
        {
          'id': 'c1461a45-6481-4b34-affb-d59f83568c64',
          'textInf': 'As on the GRE, some questions are strictly algebra based but you will also see questions'+ 'that involve the use of algebra.',
          'img': 'http://grockit.com/blog/wp-content/uploads/2015/01/canstockphoto159045311-495x400.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-algebra/',
        },
        {
          'id': '477b9b67-fa94-39fb-01a9-34102dddea9b',
          'textInf': 'The geometry tested on the GRE is basic – but that doesn’t mean it’s easy.',
          'img': 'http://grockit.com/blog/wp-content/uploads/2011/09/canstockphoto9473671-495x400.jpg',
          'link': 'http://grockit.com/blog/gre-study-guide-geometry/'
        },
        {
          'id': '10055e9e-dc22-6e73-bdad-1135f4d742b6',
          'textInf': 'The GRE will test your ability to draw conclusions about sets of objects or data.'
          'img': 'http://grockit.com/blog/wp-content/uploads/2012/03/canstockphoto9440015-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-data-analysis-interpretation/'
        },
        {
          'id': '6774eeda-05e3-8069-5b5c-38aa52474603',
          'textInf': 'The GRE Reading Comprehension section is designed to test your ability to quickly and '+
          'effectively assess ideas and information.'
          'img': 'http://grockit.com/blog/wp-content/uploads/2014/03/canstockphoto8742483-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-formulas-inequalities-absolute-value/'
        },
        {
          'id': 'ee838ae8-079c-1d09-fd2f-1c418ee92fde',
          'textInf': 'Reading Comprehension section is designed to test your ability to quickly and effectively assess ideas...'
          'img': 'http://grockit.com/blog/wp-content/uploads/2012/04/canstockphoto4871175-800x321.jpg'
          'link': 'http://grockit.com/blog/gre-study-guide-reading-comprehension'
        },
        {
            'id': 'e2008b15-79fd-dc56-11af-6582a028b5c9',
            'textInf': 'Text Completion questions on the GRE test your ability to recognize the point of a '+
            'sentence and find the best word(s) to fit its meaning.'
            'img': 'http://grockit.com/blog/wp-content/uploads/2012/05/canstockphoto3339507-800x321.jpg'
            'link': 'http://grockit.com/blog/gre-study-guide-text-completion/'
          },
        {
            'id': '7fa4af1d-782b-7a01-e3c7-342af1eaae0d',
            'textInf': 'Your job is to find the two answer choices that, when inserted into the sentence'
            'img': 'http://grockit.com/blog/wp-content/uploads/2012/02/canstockphoto0422182-800x321.jpg'
            'link': 'http://grockit.com/blog/gre-study-guide-sentence-equivalence/'
          }]
      _.merge data.smart_practice.items, info
      return data


dashboardService.$inject = ['$q','resource']
module.exports = dashboardService