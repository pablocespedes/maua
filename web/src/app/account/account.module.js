'use strict';
   var account =  angular.module("grockitApp.account",[]).config(function($httpProvider,$routeProvider, $controllerProvider) {
       account.controller = $controllerProvider.register;
   });

