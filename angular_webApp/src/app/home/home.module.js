    var app =  angular.module("gRockitApp.home",[]).config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
        app.controller    = $controllerProvider.register;
        app.directive     = $compileProvider.directive;
        app.routeProvider = $routeProvider;
        app.factory       = $provide.factory;
        app.service       = $provide.service;

        var filePath = {
            home: 'app/home/home.ctrl.js'
        };
        $routeProvider.when('/home', {templateUrl: 'app/home/home.tpl.html', resolve:{deps:function($q, $rootScope){
            var deferred = $q.defer();
            var essentials = [ filePath.home ];
            $script(essentials,function(){
                // all dependencies have now been loaded by $script.js so resolve the promise
                $rootScope.$apply(function() {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }}, controller: 'HomeController'});

    });