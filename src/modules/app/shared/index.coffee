'use strict'

module.exports = angular.module('grockitApp.shared', [
  require('./components/index').name
  require('./filters/index').name
  require('./services/index').name
])
