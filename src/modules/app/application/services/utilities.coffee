
utilities = ($state,$rootScope, $http, $location, $q, $window, urlsCons) ->
  new class Utilities
    constructor: () ->
      @currentTrack = {}

    _grockitHostEvaluation = (isNewGrockit) ->
      if isNewGrockit
        if location.host is 'localhost:8080'
        then urlsCons.oldGrockit else urlsCons.liveGrockit
      else
        if location.host is 'localhost:8080'
        then urlsCons.stagingGrockit
        else if location.host is urlsCons.ww2Grockit2
        then urlsCons.oldGrockit else location.origin

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
      if angular.isDefined($state.params)
      then $state.params[key] else undefined

    setCurrentParam : (key, param) ->
      $state.params[key] = null
      $state.params[key] = param
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

    getIndexArray : (arr, key, val) ->
      i = 0
      while i < arr.length
        if arr[i][key] == val
          return i
        i++
      -1

    newGrockit : ->
      _grockitHostEvaluation(true)

    originalGrockit : ->
      _grockitHostEvaluation(false)

    htmlToPlaintext :(text) ->
      return String(text).replace(/<[^>]+>/gm, '')

    currentPage :(page)->
      $rootScope.currentPage = page

    existy:(x)->
      return x != null and x != 'null' and x != undefined and
       x != 'undefined'and angular.isDefined(x)

    truthy:(x)->
      return (x isnt false) and @existy(x)

    lastUrlWord:->
      sections = $location.path().split('/')
      word = sections[sections.length - 1]
      console.log word
      word

utilities.$inject=['$state','$rootScope', '$http', '$location','$q',
'$window','urlsCons']
module.exports =utilities