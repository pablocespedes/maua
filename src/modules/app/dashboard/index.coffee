'use strict'

#Requering files
DashboardService = require('./services/dashboard.service')
DashboardController = require('./dashboard.controller')
TrackList =  require('./directives/track-list/track-list')
Challenge =  require('./directives/challenge/challenge')

module.exports = angular.module('grockitApp.dashboard', [])
    .config(($stateProvider) ->
      $stateProvider.state 'dashboard',
      url: '/{subject}/dashboard'
      parent: 'common'
      templateUrl: 'app/dashboard/dashboard.html'
      controller: 'DashboardController'
      controllerAs: 'vmDash'
      return
)
.directive 'trackList', TrackList
.directive 'challenge', -> new Challenge()
.factory 'dashboardService', DashboardService
.controller 'DashboardController', DashboardController
