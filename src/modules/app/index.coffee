'use strict'

module.exports = angular.module('grockitApp', [
  'ui.router'
  'ngMessages'
  'restangular'
  require('../../../tmp/templates').name
  require('./application/index').name
  require('./account/register/index').name
  #require('./account/login/index').name
  require('./dashboard/index').name
])
.config(require('./index.config'))
