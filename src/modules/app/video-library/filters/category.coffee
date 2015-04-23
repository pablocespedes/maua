categoryFilter = ->
  (video, selectedVideo) ->
    if !angular.isUndefined(video) and
     !angular.isUndefined(selectedVideo) and selectedVideo.length > 0
      tempVideos = []
      angular.forEach video, (video) ->
        if video.id is parseInt(selectedVideo)
          console.log video
          tempVideos.push video
          return
      console.log tempVideos
      tempVideos
    else
      video
module.exports = categoryFilter