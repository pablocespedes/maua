'use strict'

class VideoController
  # Services injected into the controller constructor
  constructor: ($mdSidenav,@videoService) ->
    @videoTitle = 'GRE Video Library (58 videos)'
    @mdSidenav = $mdSidenav
    @getVideoList()
    @isClicked = true

  getVideoList:->
    @videoService.getVideoData().then (result) =>
      @videos = result

  toggleRight : ->
    @mdSidenav('right').toggle().then ->
      return
  close : ->
    @mdSidenav('right').close().then ->
      return


VideoController.$inject = ['$mdSidenav','videoService']

module.exports = VideoController
