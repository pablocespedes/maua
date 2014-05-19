'use strict';

var app =  angular.module("gRockitApp.practice",['ngSanitize']).config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
    app.controller    = $controllerProvider.register;
    app.directive     = $compileProvider.directive;
    app.routeProvider = $routeProvider;
    app.factory       = $provide.factory;
    app.service       = $provide.service;

    var filePath = {
        practice: { practiceCtrl: 'app/practice/practice.ctrl.js',
                    practiceDrctv:'app/practice/practice.directive.js',
                    practiceServ:'app/practice/practice.service.js'
        }
    }

    $routeProvider.when('/practice', {templateUrl: 'app/practice/practice.tpl.html', resolve:{deps:function($q, $rootScope){
        var deferred = $q.defer();
        var essentials = [
            filePath.practice.practiceCtrl,
            filePath.practice.practiceDrctv,
            filePath.practice.practiceServ
        ];
        $script(essentials,function(){
                // all dependencies have now been loaded by $script.js so resolve the promise
                $rootScope.$apply(function() {
                    deferred.resolve();
            });
        });
        return deferred.promise;
    }}, controller: 'PracticeController'});

});