'use strict';

var app =  angular.module("grockitApp.practiceGame",[]).config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
    app.controller    = $controllerProvider.register;
    app.directive     = $compileProvider.directive;
    app.routeProvider = $routeProvider;
    app.factory       = $provide.factory;
    app.service       = $provide.service;

    var filePath = {
        practice: {
            practiceCtrl: 'app/practiceGame/practice/practice.ctrl.js',
            practiceDrctv:'app/practiceGame/practice/practice.directive.js',
            practiceServ:'app/practiceGame/practice/practice.service.js'
        },
        dashboard:{
            dashCtrl: 'app/practiceGame/dashboard/dashboard.ctrl.js',
            dashServ:'app/practiceGame/dashboard/dashboard.service.js'
        }
     };


    $routeProvider.when('/dashboard-practice', {templateUrl: 'app/practiceGame/dashboard/dashboard.tpl.html', resolve:{deps:function($q, $rootScope){
        var deferred = $q.defer(),
            essentials = [
                filePath.dashboard.dashServ,
                filePath.dashboard.dashCtrl
            ];
        $script(essentials,function(){
            $rootScope.$apply(function() {
                deferred.resolve();
            });
        });
        footer();
        setActiveMenu();
        return deferred.promise;
    }}, controller: 'DetailDashController'});


    $routeProvider.when('/:subject/practice', {templateUrl: 'app/practiceGame/practice/practice.tpl.html', resolve:{deps:function($q, $rootScope){
        var deferred = $q.defer(),
            essentials = [
                filePath.practice.practiceCtrl,
                filePath.practice.practiceDrctv,
                filePath.practice.practiceServ
            ];
        $script(essentials,function(){
            $rootScope.$apply(function() {
                deferred.resolve();
            });
        });
        footer();
        setActiveMenu();
        return deferred.promise;
    }}, controller: 'PracticeController'});

    $routeProvider.otherwise({redirectTo: '/dashboard-practice'});

});
