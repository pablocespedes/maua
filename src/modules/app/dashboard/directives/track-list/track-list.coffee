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

      scope.showAdvanced = (ev) ->
        console.log 'test'
        $mdDialog.show
          #controller: DialogController
          templateUrl: 'app/dashboard/directives/track-list/dashboard.tags.html'
          targetEvent: ev

      scope.opendDialog = (dialogId) ->

      scope.imgs = [
       'http://grockit.com/blog/wp-content/uploads/2011/06/canstockphoto13006047-705x470.jpg'
       'http://grockit.com/blog/wp-content/uploads/2012/01/canstockphoto16812121-705x470.jpg'
       'http://grockit.com/blog/wp-content/uploads/2014/12/canstockphoto4798442-705x470.jpg'
       'http://grockit.com/blog/wp-content/uploads/2015/02/canstockphoto14710208-705x482.jpg'
       'http://grockit.com/blog/wp-content/uploads/2015/02/canstockphoto5790797-705x516.jpg'
       'http://grockit.com/blog/wp-content/uploads/2015/02/canstockphoto7344095-705x470.jpg'
       'http://grockit.com/blog/wp-content/uploads/2011/08/canstockphoto14635831-705x470.jpg'
       'http://grockit.com/blog/wp-content/uploads/2015/02/canstockphoto23239215-705x470.jpg'
       'http://grockit.com/blog/wp-content/uploads/2012/01/canstockphoto13848070-705x470.jpg'
      ]

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

trackList.$inject = ['$mdDialog']
module.exports = trackList