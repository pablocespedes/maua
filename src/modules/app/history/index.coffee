'use strict'

#Requering files
HistoryService = require('./services/history.service')
CollapseManager = require('./services/collapseManager.service')
HistoryController = require('./history.controller')
HistoryList =  require('./directives/history-list/history-list')
SetHeight =  require('./directives/set-height/set-height')
WhenScrolled =  require('./directives/when-scrolled/when-scrolled')


module.exports = angular.module('grockitApp.history', [])
    .config(($stateProvider) ->
      $stateProvider.state 'history',
      url: '/{subject}/history'
      parent: 'common'
      templateUrl: 'app/history/history.html'
      controller: 'HistoryController'
      controllerAs: 'vmHist'
      return
)

.factory 'history', HistoryService
.factory 'collapseManager', CollapseManager
.directive 'historyList', HistoryList
.directive 'setHeight', SetHeight
.directive 'whenScrolled', WhenScrolled
.controller 'HistoryController', HistoryController
