
trackList = ($mdDialog,dashboardService)->
  new class TrackList
    constructor: () ->
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
        animEv='webkitAnimationEnd mozAnimationEnd '+
        'MSAnimationEnd oanimationend animationend'
        selector = angular.element('#' + track.id )

        trackCopy = track
        trackCopy.favorite = !trackCopy.favorite
        trackCopy.position = if trackCopy.favorite then 0 else @tracks.length-1

        _.pull @tracks, track

        _.forEach @tracks, (item,index)->
          item.position = index+1
        if trackCopy.favorite is true
          @tracks.unshift(trackCopy)
        else
          @tracks.push(trackCopy)
        dashboardService.saveCardPosition(@tracks)

        selector
        .addClass('fadeIn')
        .one animEv, ()->
          selector.removeClass('fadeIn')
          return

        return


trackList.$inject = ['$mdDialog','dashboardService']
module.exports = trackList