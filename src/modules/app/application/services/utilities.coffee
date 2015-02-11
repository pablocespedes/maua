
utilities = ($rootScope, $http, $location, $stateParams, $q, $window) ->
  new class Utilities
    constructor: () ->
      @currentTrack = {}
    getResourceObject : (resourceObject) ->
      deferred = $q.defer()
      videoObject = {}
      videoId = ''
      if resourceObject.resource_type is 'youtube'
        video = getYoutubeVideosId(resourceObject.resource)
        video.then((idVid) ->
          videoId = idVid
          YoutubeVideoApi.setYouTubeTitle idVid
        ).then (videoTime) ->
          videoObject =
            videoTime: videoTime
            videoId: videoId
            resourceType: resourceObject.resource_type
          deferred.resolve videoObject
          return
      else
        videoObject =
          videoTime: null
          videoId: decodeURIComponent(resourceObject.resource).replace(/"/g, '')
          resourceType: resourceObject.resource_type
        deferred.resolve videoObject
      deferred.promise

    getActiveTrack : ->
      @currentTrack

    setActiveTrack : (subject, trackId) ->
      @currentTrack.subject = subject
      @currentTrack.trackId = trackId

    random : (min, max) ->
      min = min | 0
      _.random min, max

    internalRedirect : (url) ->
      $location.path url

    redirect : (url) ->
      $window.location = url

    getCurrentParam : (key) ->
      if angular.isDefined($stateParams.current)
      then $stateParams.current.pathParams[key] else undefined

    setCurrentParam : (key, param) ->
      $stateParams.current.pathParams[key] = null
      $stateParams.current.pathParams[key] = param
      return

    getYoutubeVideosId: (url) ->
      id = ''
      url = url
        .replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      if url[2] != undefined
        id = url[2].split(/[^0-9a-z_]/i)
        id = id[0]
      else
        id = url
      id

    setGroupTitle : (title) ->
      if $rootScope.groupTitle == null or
          $rootScope.groupTitle == '' or $rootScope.groupTitle != title
        $rootScope.groupTitle = title
      return

    getGroupTitle: ->
      $rootScope.groupTitle

utilities.$inject=['$rootScope', '$http', '$location',
 '$stateParams', '$q', '$window']
module.exports =utilities