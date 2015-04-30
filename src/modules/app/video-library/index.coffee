
VideoController = require('./video.controller')
VideoService=  require('./services/video.service')

videoService = (videoService)->
  videoService.getVideoData('gre')

videoService.$inject = ['videoService']

module.exports = angular.module('grockitApp.videolibrary', [])
    .config(($stateProvider) ->
      $stateProvider.state 'video-library',
      url: '/{subject}/video-library'
      parent: 'common'
      templateUrl: 'app/video-library/video.html'
      controller: 'VideoController'
      controllerAs: 'vmVideo'
      resolve: videoService: videoService

)
.filter 'categoryFilter', require('./filters/category')
.factory 'videoService', VideoService
.controller 'VideoController', VideoController

