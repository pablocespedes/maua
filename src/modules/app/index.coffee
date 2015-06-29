'use strict'

run = ($rootScope, $location, userPreflight) ->
  $rootScope.$on '$locationChangeSuccess', (event, next, current) ->
    userPreflight.checkUser event
  return


module.exports = angular.module('grockitApp', [
  'ngMaterial'
  'ui.router'
  'ngMessages'
  'ngSanitize'
  #'satellizer'
  'restangular'
  'ngResource',
  'ngCookies',
  'materialDatePicker',
  require('../../../tmp/templates').name
  require('./app.config/index').name
  require('./application/index').name
  require('./analytics/index').name
  # require('./account/register/index').name
  require('./account/logout/index').name
  # require('./account/login/index').name
  require('./dashboard/index').name
  require('./history/index').name
  require('./questions/index').name
  require('./question-review/index').name
  require('./practices/index').name
  require('./question-view/index').name
  require('./video-library/index').name
  require('./payments/index').name
  require('./question-of-day/index').name
  require('./kap-test-starter/index').name
]).run run

run.$inject = [
  '$rootScope'
  '$location'
  'userPreflight'
]
