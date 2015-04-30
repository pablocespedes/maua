categoryFilter = ($mdSidenav)->
  (video, selectedVideo) ->
    if !angular.isUndefined(video) and
     !angular.isUndefined(selectedVideo) and selectedVideo.length > 0
      tempVideos = []
      angular.forEach video, (video) ->
        if video.id is parseInt(selectedVideo)
          tempVideos.push video
          return
      tempVideos
    else
      video
categoryFilter.$inject = ['$mdSidenav']
module.exports = categoryFilter