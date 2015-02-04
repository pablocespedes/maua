'use strict'
### @ngInject ###
class LoginController
  # Services injected into the controller constructor
  constructor: ($rootScope,$state,$auth,@alert) ->
    @auth=$auth
    @state=$state
    $rootScope.bodylayout = 'page-signin';

  submit:() ->
    @auth.login(@email,@password)
    .then (res) =>
      @alert.show "success", "Welcome!",
      "thanks for coming back "+res.data.user.email+"!"
      @state.go 'dashboard'
     ##Error handler missing
  authenticate:(provider) ->
    @auth.authenticate(provider)
    .then (res) =>
      @alert.show "success", "Welcome!" + res.data.user.displayName
      @state.go 'dashboard'


LoginController.$inject = ['$rootScope','$state','$auth','alert']

module.exports = LoginController
