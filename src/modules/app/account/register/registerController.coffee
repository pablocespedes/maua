'use strict'
### @ngInject ###
class RegisterController
  # Services injected into the controller constructor
  constructor: ($rootScope,$auth,$state,@alert) ->
    @auth=$auth
    @state=$state
    $rootScope.bodylayout = 'page-signup'

  submit:() ->
    @auth.signup(@email,@password)
    .then (res) =>
      @alert.show "success", "Account Created!", res.data.user.email + "!"
      @state.go 'dashboard'

RegisterController.$inject = ['$rootScope','$auth','$state','alert']

module.exports = RegisterController
