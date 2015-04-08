'use strict'

#Requering files
PracticeService = require('./services/practice.services')
PracticeUtilities = require('./services/practice.utilities')
SplashMessages = require('./services/splash.service')
PracticeController = require('./practice.controller')


module.exports = angular.module('grockitApp.practice', [])
    .config(($stateProvider) ->
      $stateProvider.state 'custom-practice',
      url: '/{subject}/custom-practice'
      parent: 'common'
      templateUrl: 'app/practices/practice.html'
      controller: 'PracticeController'
      controllerAs: 'vmPr'
)
.constant 'practiceConstants',
  'optionList': 'abcdefghijklmnopqrstuvwxyz'
  'questionTypesUrl': 'app/questions/directives/'
.factory 'practiceService', PracticeService
.factory 'splashMessages', SplashMessages
.factory 'practiceUtilities', PracticeUtilities
.controller 'PracticeController', PracticeController
