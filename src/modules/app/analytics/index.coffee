module.exports = angular.module('grockitApp.analyticService', [])
  .run ($rootScope, $window, $location, GoogleTagManager)->
    $rootScope.$on '$viewContentLoaded', ->
      path = $location.path()
      absUrl = $location.absUrl()
      virtualUrl = absUrl.substring(absUrl.indexOf(path))
      GoogleTagManager.push
        event: 'virtualPageView'
        virtualUrl: virtualUrl
      return

.factory 'GoogleTagManager', require('./services/googleTagManager')
.factory 'ListenloopUtil', require('./services/listenLoop')
.factory 'GaUtil', require('./services/ga')
.factory 'InspectletUtil', require('./services/inspectLet')

