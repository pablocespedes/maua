Resource=require('../../application/services/_api.base')

videoService = ($q,resource,utilities)->
  new class VideoService extends resource
    constructor: () ->
      super()
      @baseUrl = utilities.originalGrockit()

    appendParams:(videos, index)->
      _.forEach videos[index].videos, (video)->
        video.stream_url = video.stream_url +
        '?badge=0&byline=0&portrait=0&title=0&fullscreen=1'
      if (videos.length-1) > index
        index++
        @appendParams(videos, index)
      return videos

    getVideoData : (groupId) ->
      deferred = $q.defer()
      index = 0
      @show(groupId,'video_courses').then (result) =>

        @videoData = @appendParams(result.data.video_courses, index)

        deferred.resolve @videoData
      deferred.promise

    redirectVideoLib:(groupId)->
      utilities.redirect(@baseUrl + '/' + groupId + '/video_courses')



videoService.$inject = ['$q','resource','utilities']
module.exports = videoService
