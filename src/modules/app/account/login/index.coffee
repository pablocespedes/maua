'use strict'

module.exports = angular.module('grockitApp.login', [])
    .config(($stateProvider) ->
      $stateProvider.state 'login',
      url: '/login'
      templateUrl: 'app/account/login/login.html'
      controller: 'LoginController'
      return
)
.controller('LoginController', require('./loginController'))



