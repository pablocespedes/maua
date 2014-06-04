'use strict';

var app =  angular.module("grockitApp.practice",[]).config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
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
    var essentials = [
        filePath.practice.practiceCtrl,
        filePath.practice.practiceDrctv,
        filePath.practice.practiceServ
    ];

    $routeProvider.when('/practice', {templateUrl: 'app/practice/practice.tpl.html', resolve:{deps:function($q, $rootScope){
        var deferred = $q.defer();
        $script(essentials,function(){
            // all dependencies have now been loaded by $script.js so resolve the promise
            $rootScope.$apply(function() {
                deferred.resolve();
            });
        });
        footer();
        setActiveMenu();
        return deferred.promise;
    }}, controller: 'PracticeController'});

    $routeProvider.when('/math', {templateUrl: 'app/practice/practiceModuleTemplates/math.tpl.html', resolve:{deps:function($q, $rootScope){
        var deferred = $q.defer();
        $script(essentials,function(){
            // all dependencies have now been loaded by $script.js so resolve the promise
            $rootScope.$apply(function() {
                deferred.resolve();
            });
        });
        footer();
        setActiveMenu();
        return deferred.promise;
    }}, controller: 'PracticeController'});

});
