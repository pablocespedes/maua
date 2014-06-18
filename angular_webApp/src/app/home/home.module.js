'use strict';
   var home =  angular.module("grockitApp.home",[]).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,UserRoles) {
       home.controller = $controllerProvider.register;
       home.directive = $compileProvider.directive;
       home.routeProvider = $routeProvider;
       home.factory = $provide.factory;
       home.service = $provide.service;

       var filePath = {
           dashboard: {
               dashCtrl: 'app/practiceGame/dashboard/sDashboard.ctrl.js',
               dashServ: 'app/practiceGame/dashboard/sDashboard.service.js'
           }
       };

       $routeProvider.when('/:subject/dashboard', {templateUrl: 'app/home/dashboard/dashboard.tpl.html', resolve: {deps: function ($q, $rootScope) {
           var deferred = $q.defer(),
               essentials = [
                   filePath.dashboard.dashServ,
                   filePath.dashboard.dashCtrl
               ];
           $script(essentials, function () {
               // all dependencies have now been loaded by $script.js so resolve the promise
               $rootScope.$apply(function () {
                   deferred.resolve();
               });
           });
           return deferred.promise;
       }},
       controller: 'SimpleDashController',
       access: {
           authorizedRoles: [UserRoles.admin, UserRoles.member]
       }
       });

       $routeProvider.otherwise({redirect:'/'});
   });

