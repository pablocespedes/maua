'use strict'

module.exports = angular.module('grockitApp.logout', [])
    .config(($stateProvider) ->
      $stateProvider.state 'logout',
      url: '/logout'
      controller: 'LogoutController'
      return
)
.controller 'LogoutController', require('./logoutController')

