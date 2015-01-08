'use strict'

module.exports = angular.module('grockitApp.dashboard', [])
    .config(($stateProvider) ->
      $stateProvider.state 'dashboard',
      url: ''
      templateUrl: 'app/signUp/signUp.html'
      controller: 'RegisterController',
      controllerAs: 'vmReg'
      return
).controller('RegisterController', require('./registerController'))
