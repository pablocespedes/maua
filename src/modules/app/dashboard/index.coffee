'use strict'
module.exports = angular.module('grockitApp.dashboard', [])
    .config ($stateProvider) ->
      $stateProvider.state 'dashboard',
      url: '/{subject}/dashboard'
      parent: 'common'
      templateUrl: 'app/dashboard/dashboard.html'
      controller: 'DashboardController'
      controllerAs: 'vmDash'
      return
.directive 'trackList', require('./directives/track-list/track-list')
.directive 'challenge', require('./directives/challenge/challenge')
.factory 'dashboardService', require('./services/dashboard.utils')
.controller 'DashboardController', require('./dashboard.controller')
