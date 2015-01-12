'use strict'

module.exports = angular.module('grockitApp', [
  'ui.router'
  'restangular',
  'ngMessages'
  require('../../../tmp/templates').name
  require('./components/index').name
  require('./account/register/index').name
  require('./account/login/index').name
  require('./application/index').name
  require('./dashboard/index').name
])
.config(require('./index.config'))
