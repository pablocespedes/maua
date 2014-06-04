'use strict';
   var home =  angular.module("grockitApp.home",[]).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
        home.controller    = $controllerProvider.register;
        home.directive     = $compileProvider.directive;
        home.routeProvider = $routeProvider;
        home.factory       = $provide.factory;
        home.service       = $provide.service;

        $routeProvider.when('/home', {templateUrl: 'app/home/home.tpl.html', resolve:{deps:function($q, $rootScope){
            var deferred = $q.defer();

            var essentials = [
                'app/home/home.service.js',
                'app/home/home.ctrl.js'
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
        }}, controller: 'HomeController'});

    });
