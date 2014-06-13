'use strict';
   var home =  angular.module("grockitApp.home",[]).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,userRoles) {
       home.controller = $controllerProvider.register;
       home.directive = $compileProvider.directive;
       home.routeProvider = $routeProvider;
       home.factory = $provide.factory;
       home.service = $provide.service;
       //$httpProvider.defaults.headers.common.Authorization='Token token=BAh7CUkiD3Nlc3Npb25faWQGOgZFVEkiJTJmYzNiODVhN2M1YzE3YmU4YWRiZThlMDM1OWVkYjgwBjsAVEkiDHVzZXJfaWQGOwBGSSIpZTFhMmYyZDAtYzAwNS0wMTMwLTJmNzAtMTIzMTM5MGVmOTgxBjsAVEkiEF9jc3JmX3Rva2VuBjsARkkiMWMrRWZ3cFRTeTBaSGtNOWxGaVVYTENQQytFT1pMcFYrQzMwM3dMU1UvWFE9BjsARkkiDWxvY2F0aW9uBjsARkM6LUFjdGl2ZVN1cHBvcnQ6Okhhc2hXaXRoSW5kaWZmZXJlbnRBY2Nlc3N7CEkiD2NvbnRyb2xsZXIGOwBGSSIKbG9iYnkGOwBUSSILYWN0aW9uBjsARkkiDXByYWN0aWNlBjsAVEkiDWdyb3VwX2lkBjsARkkiCHNhdAY7AFQ';

       $routeProvider.when('/:subject/dashboard', {templateUrl: 'app/home/dashboard/dashboard.tpl.html', resolve: {deps: function ($q, $rootScope) {
           var deferred = $q.defer(),
               essentials = [
                   'app/home/dashboard/dashboard.service.js',
                   'app/home/dashboard/dashboard.ctrl.js'
               ];
           $script(essentials, function () {
               // all dependencies have now been loaded by $script.js so resolve the promise
               $rootScope.$apply(function () {
                   deferred.resolve();
               });
           });
           footer();
           setActiveMenu();
           return deferred.promise;
       }},
           controller: 'SimpleDashController',
           data: {
               authorizedRoles: [userRoles.admin, userRoles.member]
           }
       });


   });

