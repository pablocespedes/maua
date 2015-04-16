'use strict'
videoList = ()->
  new class VideoList
    constructor: () ->

    restrict: 'AE'
    replace: true
    templateUrl: 'app/video-library/directives/video-list/video-list.html'
    scope:
      videos:'='
      isClicked:'='
    link: (scope, element, attr) ->


module.exports = videoList