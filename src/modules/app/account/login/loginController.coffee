'use strict'

### @ngInject ###
class LoginController

  # Services injected into the controller constructor
  @inject: ['$rootScope','$scope']
 
  constructor: ($rootScope,$scope) ->
    $rootScope.bodylayout = 'page-signin';

 
module.exports = LoginController