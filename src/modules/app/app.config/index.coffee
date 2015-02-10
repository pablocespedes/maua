
config = require('./config')()
init = config.initConfig
init.$inject = ['$httpProvider','$stateProvider',
  '$urlRouterProvider','RestangularProvider','apiUrl']

module.exports = angular.module('grockitApp.config', [])
.constant('apiUrl',config.baseUrl)
.constant('loginUrl',config.loginUrl())
.constant('registerUrl',config.registerUrl())
.config(init)

