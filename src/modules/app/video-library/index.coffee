module.exports = angular.module('grockitApp.videolibrary', [])
    .config ($stateProvider) ->
      $stateProvider.state 'video-library',
      url: '/{subject}/video-library'
      parent: 'common'
      templateUrl: 'app/video-library/video.html'
      controller: 'VideoController'
      controllerAs: 'vmVideo'
.filter 'categoryFilter', require('./filters/category')
.factory 'videoService', require('./services/video.service')
.controller 'VideoController', require('./video.controller')