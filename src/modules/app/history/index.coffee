'use strict'
module.exports = angular.module('grockitApp.history', [])
    .config ($stateProvider) ->
      $stateProvider.state 'history',
      url: '/{subject}/history'
      parent: 'common'
      templateUrl: 'app/history/history.html'
      controller: 'HistoryController'
      controllerAs: 'vmHist'
      return
.factory 'history', require('./services/history.service')
.factory 'collapseManager', require('./services/collapseManager.service')
.directive 'historyList', require('./directives/history-list/history-list')
.directive 'setHeight', require('./directives/set-height/set-height')
.directive 'whenScrolled', require('./directives/when-scrolled/when-scrolled')
.controller 'HistoryController', require('./history.controller')
