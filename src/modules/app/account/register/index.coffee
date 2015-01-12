'use strict'

module.exports = angular.module('grockitApp.register', [])
    .config(($stateProvider) ->
      $stateProvider.state 'register',
      url: '/register'
      templateUrl: 'app/account/register/register.html'
      controller: 'RegisterController'
      return
)
.directive('matchValidator',require('./directives/matchValidator'))
.directive('passwordCharactersValidator','./directives/passwordCharactersValidator')
.controller('RegisterController', require('./registerController'))
