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
.directive 'scorePrediction', require('./directives/score/score')
.directive 'userProgress', require('./directives/user-progress/user-progress')
.directive 'countDown', require('./directives/count-down/count-down')
.factory 'testCountService', require('./services/test.count.service')
.factory 'learnContent', require('./services/learn.content')
.factory 'dashboardService', require('./services/dashboard.utils')
.controller 'DashboardController', require('./dashboard.controller')
