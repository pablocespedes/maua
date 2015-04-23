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
  'satellizer'
  'restangular'
  'ngResource',
  'ngCookies'
  require('../../../tmp/templates').name
  require('./app.config/index').name
  require('./application/index').name
  require('./account/register/index').name
  require('./account/logout/index').name
  require('./account/login/index').name
  require('./dashboard/index').name
  require('./history/index').name
  require('./questions/index').name
  require('./question-review/index').name
  require('./practices/index').name
  require('./video-library/index').name
]).run run

run.$inject = [
  '$rootScope'
  '$location'
  'userPreflight'
]
