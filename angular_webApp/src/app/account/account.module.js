'use strict';
   var account =  angular.module("grockitApp.account",[]).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
       account.controller = $controllerProvider.register;
       account.directive = $compileProvider.directive;
       account.routeProvider = $routeProvider;
       account.factory = $provide.factory;
       account.service = $provide.service;


   });

