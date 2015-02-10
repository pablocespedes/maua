'use strict'

module.exports = angular.module('grockitApp.app', [])
.factory('resource',require('./services/api.base'))
.factory('authToken',require('./services/authToken'))
.factory('authInterceptor',require('./services/authInterceptor'))
.service('logger', require('./services/logger'))
.factory('alert', require('./services/alert'))
.controller('AppController', require('./appController'))
