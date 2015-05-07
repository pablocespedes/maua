'use strict'
trackList = ($mdDialog)->
  new class TrackList
    constructor: () ->
      ## Constructor stuff
    restrict: 'AE'
    replace: false
    templateUrl: 'app/dashboard/directives/track-list/track-list.html'
    scope:
      tracks: '='
      startPractice: '='
      isVisible: '='
      canPractice: '='
      titles: '='
    link: (scope, element, attr) ->
      overlayTrack = null
      scope.shouldShowOverlay = (track) ->
        if track.hasScore
          false
        else if overlayTrack == null
          overlayTrack = track
          true
        else
          overlayTrack.id == track.id

      scope.empty = (track) ->
        if angular.isDefined(track.items) and
         track.items.length > 0 then true else false

      scope.getYourScorePredictionUrl = (track) ->
        baseUrl = utilities.originalGrockit(false).url
        utilities.redirect baseUrl + '/assessment/for_track/' + track.id

      scope.setFavorite = (track)->
        trackCopy = track

        trackCopy.favorite = !trackCopy.favorite
        trackCopy.position = 0

        _.pull @tracks, track

        _.forEach @tracks, (item,index)->
          item.position = index+1
        if trackCopy.favorite is true
          @tracks.unshift(trackCopy)
        else
          @tracks.push(trackCopy)
        console.log track,trackCopy,@tracks


trackList.$inject = ['$mdDialog']
module.exports = trackList