'use strict'

module.exports = angular.module('grockitApp.dashboard', [])
    .config(($stateProvider) ->
      $stateProvider.state 'dashboard',
      url: ''
      templateUrl: 'app/dashboard/dashboard.html'
      controller: 'DashboardController',
      controllerAs: 'vmDash'
      return
).controller('DashboardController', require('./dashboardController'))
