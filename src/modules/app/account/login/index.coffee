'use strict'

module.exports = angular.module('grockitApp.login', [])
    .config(($stateProvider) ->
      $stateProvider.state 'login',
      url: '/login'
      templateUrl: 'app/account/login/login.html'
      controller: 'LoginController'
      controllerAs: 'vmlog'
      return
)
.factory('loginService',require('./services/api.login'))
.controller('LoginController', require('./loginController'))



