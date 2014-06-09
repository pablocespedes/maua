'use strict';
   var home =  angular.module("grockitApp.home",[]).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
        home.controller    = $controllerProvider.register;
        home.directive     = $compileProvider.directive;
        home.routeProvider = $routeProvider;
        home.factory       = $provide.factory;
        home.service       = $provide.service;

        $routeProvider.when('/dashboard', {templateUrl: 'app/home/dashboard/dashboard.tpl.html', resolve:{deps:function($q, $rootScope){
            var deferred = $q.defer(),
             essentials = [
                'app/home/dashboard/dashboard.service.js',
                'app/home/dashboard/dashboard.ctrl.js'
            ];
            $script(essentials,function(){
                    // all dependencies have now been loaded by $script.js so resolve the promise
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
            });
            footer();
            setActiveMenu();
            return deferred.promise;
        }}, controller: 'SimpleDashController'});

    });
