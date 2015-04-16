'use strict'

class VideoController
  # Services injected into the controller constructor
  constructor: ($mdSidenav,$sce,@videoService) ->
    @sce = $sce
    @displayVideo= false
    @videoTitle = 'GRE Video Library (58 videos)'
    @mdSidenav = $mdSidenav
    @getVideoList()
    @isClicked = true

  getVideoList:->
    @videoService.getVideoData('gre').then (result) =>
      @videos = result

  toggleRight : ->
    @mdSidenav('right').toggle().then ->
      return
  close : ->
    @mdSidenav('right').close().then ->
      return

  activeVideo : (currentVideo)->
    @displayVideo= true
    url= currentVideo.stream_url.replace('https:','')
    console.log url
    @currentVideoUrl = @sce.trustAsResourceUrl(url);



VideoController.$inject = ['$mdSidenav','$sce','videoService']

module.exports = VideoController
