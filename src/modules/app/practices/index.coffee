'use strict'
module.exports = angular.module('grockitApp.practice', [])
    .config ($stateProvider) ->
      $stateProvider.state 'custom-practice',
      url: '/{subject}/custom-practice'
      parent: 'common'
      templateUrl: 'app/practices/practice.html'
      controller: 'PracticeController'
      controllerAs: 'vmPr'
.constant 'practiceConstants',
  'optionList': 'abcdefghijklmnopqrstuvwxyz'
  'questionTypesUrl': 'app/questions/directives/'
.factory 'practiceService', require('./services/practice.services')
.factory 'splashMessages', require('./services/splash.service')
.factory 'practiceUtilities', require('./services/practice.utilities')
.controller 'PracticeController', require('./practice.controller')
