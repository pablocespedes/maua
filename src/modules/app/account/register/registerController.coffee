'use strict'
### @ngInject ###
class RegisterController
  # Services injected into the controller constructor
  constructor: ($rootScope,@alert,@registerFactory) ->
    $rootScope.bodylayout = 'page-signup'
    
  submit:() =>
    @registerFactory.registerUser(@email,@password)
    .then(res) ->
      @alert "success", "Account Created!", "Welcome " + res.user.email + " !"
      
      
RegisterController.$inject = ['$rootScope','alert','registerFactory']

module.exports = RegisterController