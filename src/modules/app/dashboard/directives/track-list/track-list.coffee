
trackList = ($mdDialog,dashboardService,utilities)->
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
      challenges:'='
    link: (scope, element, attr) ->
      overlayTrack = null

      scope.empty = (track) ->
        if angular.isDefined(track.items) and
         track.items.length > 0 then true else false

      scope.getYourScorePredictionUrl = (track) ->
        baseUrl = utilities.originalGrockit(false)
        console.log baseUrl + '/assessment/for_track/' + track.id
        utilities.redirect baseUrl + '/assessment/for_track/' + track.id

      # scope.setFavorite = (track)->
      #   animEv='webkitAnimationEnd mozAnimationEnd '+
      #   'MSAnimationEnd oanimationend animationend'
      #   selector = angular.element('#' + track.id )

      #   trackCopy = track
      #   trackCopy.favorite = !trackCopy.favorite
      #  trackCopy.position = if trackCopy.favorite then 0 else @tracks.length-1

      #   _.pull @tracks, track

      #   _.forEach @tracks, (item,index)->
      #     item.position = index+1
      #   if trackCopy.favorite is true
      #     @tracks.unshift(trackCopy)
      #   else
      #     @tracks.push(trackCopy)
      #   dashboardService.saveCardPosition(@tracks)

      #   selector
      #   .addClass('fadeIn')
      #   .one animEv, ()->
      #     selector.removeClass('fadeIn')
      #     return

      #   return


trackList.$inject = ['$mdDialog','dashboardService','utilities']
module.exports = trackList