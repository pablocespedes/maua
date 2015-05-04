'use strict'

class VideoController
  # Services injected into the controller constructor
  constructor: ($mdSidenav,$sce,@videoService,@product) ->
    @sce = $sce
    @displayVideo= false
    @category = 0
    @mdSidenav = $mdSidenav
    @isClicked = true
    @getVideoData()
    @videoObserver = @product.observeGroupId().register (groupId) =>
      if groupId isnt 'gre'
        @videoService.redirectVideoLib(groupId)

  getVideoData: ->
    @videoService.getVideoData('gre').then (videos)=>
      @videos = videos

  checkNavStatus : ->
    @isVideoListOpen = @mdSidenav('video-right').isOpen()
    if not @isVideoListOpen
      @mdSidenav('video-right').open()
    else
      @mdSidenav('video-right').close()

  activeVideo : (currentVideo)->
    @displayVideo= true
    url= currentVideo.stream_url.replace('https:','')
    @currentVideoUrl = @sce.trustAsResourceUrl(url)

  opensideNav : ->
    @mdSidenav('video-right').open()

  closesideNav: ->
    @mdSidenav('video-right').close()

VideoController.$inject = ['$mdSidenav','$sce','videoService','product']

module.exports = VideoController
