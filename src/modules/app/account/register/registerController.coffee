'use strict'

### @ngInject ###
class RegisterController

  # Services injected into the controller constructor
  @inject: ['$rootScope','$scope','alert']
 
  constructor: ($rootScope,$scope) ->
    $rootScope.bodylayout = 'page-signup';

 
module.exports = RegisterController