'use strict'
module.exports = angular.module('grockitApp', [
  'ui.router'
  'ngMessages'
  'satellizer'
  'restangular'
  require('../../../tmp/templates').name
  require('./app.config/index').name
  require('./application/index').name
  require('./account/register/index').name
  require('./account/logout/index').name
  require('./account/login/index').name
  require('./dashboard/index').name
])
