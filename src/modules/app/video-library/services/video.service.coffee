Resource=require('../../application/services/_api.base')

videoService = ($q,resource)->
  new class VideoService extends resource
    constructor: () ->
      super()

    getVideoData : (groupId) ->
      deferred = $q.defer()

      @show(groupId,'video_courses').then (result) =>
        console.log result
        @videoData = result.data.video_courses
        deferred.resolve @videoData
      deferred.promise


videoService.$inject = ['$q','resource']
module.exports = videoService
