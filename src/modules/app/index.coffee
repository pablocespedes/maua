'use strict'

module.exports = angular.module('grockitApp', [
  'ui.router'
  'ngMessages'
  require('../../../tmp/templates').name
  require('../common/index').name
  require('./application/index').name
  require('./dashboard/index').name
])
.config(require('./index.config'))
