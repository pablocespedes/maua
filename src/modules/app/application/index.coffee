'use strict'

module.exports = angular.module('grockitApp.app', [])
.service('alert', require('./services/base.service'))
.controller('AppController', require('./appController'))

