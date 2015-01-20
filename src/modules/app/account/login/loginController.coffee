'use strict'
### @ngInject ###
class LoginController
  # Services injected into the controller constructor
  constructor: ($rootScope,@alert,@loginService) ->
    $rootScope.bodylayout = 'page-signin';
    
  submit:() ->
    @loginService.signUser(@email,@password)
    .then (res) =>
      @alert.show "success", "Welcome!", "thanks for coming back "+res.user.email + "!"
      
      
LoginController.$inject = ['$rootScope','alert','loginService']

module.exports = LoginController