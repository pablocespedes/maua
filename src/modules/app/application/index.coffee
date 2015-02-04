'use strict'

module.exports = angular.module('grockitApp.app', [])

.factory('authToken',require('./services/authToken'))
.factory('authInterceptor',require('./services/authInterceptor'))
.service('logger', require('./services/logger'))
.service('alert', require('./services/alert'))
.controller('AppController', require('./appController'))
