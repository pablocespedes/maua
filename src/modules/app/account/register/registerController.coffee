#'use strict'
#### @ngInject ###
#class RegisterController
#
#  # Services injected into the controller constructor
#
#  constructor: ($rootScope,alert,registerFactory) ->
#    $rootScope.bodylayout = 'page-signup'
#    @alert = alert
#    @alert "success", "Account Created!", "Welcome  !"
#  submit:() ->
#    registerFactory.registerUser(@email,@password)
#    .then(res) ->
#      @alert "success", "Account Created!", "Welcome " + res.user.email + " !"
#RegisterController.$inject = ['$rootScope','alert','registerFactory']
#module.exports = RegisterController

module.exports = ['$rootScope','alert','registerFactory',
($rootScope,alert,registerFactory) ->
  class RegisterController
    constructor: ($rootScope,alert,registerFactory) ->
    $rootScope.bodylayout = 'page-signup'
    @alert = alert
    @alert "success", "Account Created!", "Welcome  !"
 
    submit:() ->
      console.log('test')
      registerFactory.registerUser(@email,@password)
      .then(res) ->
        @alert "success", "Account Created!", "Welcome " + res.user.email + " !"
      
]