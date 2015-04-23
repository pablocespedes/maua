'use strict'
### @ngInject ###
class LogoutController

  constructor: ($window,$state,$auth,@utilities,@authorization) ->
    @window = $window
    #$auth.logout()
    #$state.go('main')
  logout : ->
    #$intercom 'shutdown'
    logOut = @utilities.originalGrockit() + '/logout'
    @authorization.removeUser()
    @authorization.removeCookie()
    @window.location.href = logOut
    return

LogoutController.$inject = ['$window','$state','$auth','utilities',
'authorization']

module.exports = LogoutController
