'use strict'
module.exports = angular.module('grockitApp.kapTestStarter', [])
    .config ($stateProvider) ->
      $stateProvider.state 'kap-test-starter',
      url: '/kap-test-starter'
      templateUrl: 'app/kap-test-starter/kap-test-starter.html'
      controller: 'KapTestController'
      controllerAs: 'vmPr'
      return
.constant 'practiceConstants',
  'optionList': 'abcdefghijklmnopqrstuvwxyz'
  'questionTypesUrl': 'app/questions/directives/'
.factory 'practiceService', require('../practices/services/practice.services')
.factory 'splashMessages', require('../practices/services/splash.service')
.factory 'practiceUtilities',
  require('../practices/services/practice.utilities')
.controller 'KapTestController', require('./kap-test-starter.controller')

