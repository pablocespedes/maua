'use strict'

module.exports = angular.module('grockitApp.login', ['grockitApp.config'])
    .config(($stateProvider) ->
      $stateProvider.state 'login',
      url: '/login'
      templateUrl: 'app/account/login/login.html'
      controller: 'LoginController'
      controllerAs: 'vmlog'
      return
)
.config(require('./config/urls'))
.config(require('./config/index.config'))
.controller 'LoginController', require('./login.controller')

