'use strict'

module.exports = angular.module('grockitApp.register', ['restangular'])
    .config(($stateProvider) ->
      $stateProvider.state 'register',
      url: '/register'
      templateUrl: 'app/account/register/register.html'
      controller: 'RegisterController'
      controllerAs: 'vmreg'
      return
)

.factory('registerFactory',require('./services/api.register'))
.directive('matchValidator',require('./directives/matchValidator'))
.directive('passwordCharactersValidator',require('./directives/pswChrctersVal'))
.controller('RegisterController', require('./registerController'))
