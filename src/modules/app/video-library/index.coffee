
VideoController = require('./video.controller')
VideoList =  require('./directives/video-list/video-list')
VideoService=  require('./services/video.service')
module.exports = angular.module('grockitApp.videolibrary', [])
    .config(($stateProvider) ->
      $stateProvider.state 'video-library',
      url: '/{subject}/video-library'
      parent: 'common'
      templateUrl: 'app/video-library/video.html'
      controller: 'VideoController'
      controllerAs: 'vmVideo'
)
.factory 'videoService', VideoService
.directive 'videoList', VideoList
.controller 'VideoController', VideoController