Resource=require('../../application/services/_api.base')

videoService = ($q,resource)->
  new class VideoService extends resource
    constructor: () ->
      super()
      @videoData =
      [{
        'id': 1
        'name': 'Quantitative: Introduction'
        'description': '1.1 Intro to GRE Quantitative (1:40)'
        'videoId': 1
        'videoUrl': ''
        'css':'one'
      }
      {
        'id': 2
        'name': 'Quantitative: Introduction'
        'description': '1.2 Strategies and Question Types (22:50)'
        'videoId': 2
        'videoUrl': ''
        'css':'two'
      }
      {
        'id': 3
        'name': 'Quantitative: Arithmetic'
        'description': '2.1 Number Properties (14:55)'
        'videoId': 3
        'videoUrl': ''
        'css':'three'
      }
      {
        'id': 4
        'name': 'Quantitative: Arithmetic'
        'description': '2.2 Fractions (2:27)'
        'videoId': 4
        'videoUrl': ''
        'css':'four'
      }
      {
        'id': 5
        'name': 'Quantitative: Arithmetic'
        'description': '2.3 Decimals (4:20)'
        'videoId': 5
        'videoUrl': ''
        'css':'five'
      }
      {
        'id': 6
        'name': 'Quantitative: Arithmetic'
        'description': '2.4 Ratios and Proportions (3:19)'
        'videoId': 6
        'videoUrl': ''
      }
      {
        'id': 7
        'name': 'Quantitative: Arithmetic'
        'description': '2.5 Exponents and Roots (10:23)'
        'videoId': 7
        'videoUrl': ''
      }
      {
        'id': 8
        'name': 'Quantitative: Arithmetic'
        'description': '2.6 Factoring (8:20)'
        'videoId': 8
        'videoUrl': ''
      }]

    getVideoData : (groupId) ->
      deferred = $q.defer()
      console.log @
      @show('gre','dashboard').then (result) =>
        #@videoData = result.data.video
        deferred.resolve @videoData
      deferred.promise


videoService.$inject = ['$q','resource']
module.exports = videoService
