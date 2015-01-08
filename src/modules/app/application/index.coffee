'use strict'

module.exports = angular.module('grockitApp.app', [])
.service('alert', require('./appBase.service'))
.controller('AppController', require('./appController'))

