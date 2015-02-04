'use strict'
### @ngInject ###
class LogoutController

  constructor: ($state,$auth) ->
    $auth.logout()
    $state.go('main')

LogoutController.$inject = ['$state','$auth']

module.exports = LogoutController
