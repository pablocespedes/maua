'use strict';

var practiceGame =  angular.module("grockitApp.practiceGame",['ng-breadcrumbs'])
    .config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,UserRoles) {
        practiceGame.controller    = $controllerProvider.register;
        practiceGame.directive     = $compileProvider.directive;
        practiceGame.routeProvider = $routeProvider;
        practiceGame.factory       = $provide.factory;
        practiceGame.service       = $provide.service;

    var filePath = {
        practice: {
            practiceCtrl:   'app/practiceGame/practice/practice.ctrl.js',
            practiceDrctv:  'app/practiceGame/practice/practice.directive.js',
            practiceServ:   'app/practiceGame/practice/practice.service.js',
            youtube:        'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
        },
        dashboard: {
            dashCtrl: 'app/practiceGame/dashboard/dashboard.ctrl.js',
            dashServ: 'app/practiceGame/dashboard/dashboard.service.js'
        }
    };


    $routeProvider.when('/:subject/dashboard-practice', {templateUrl: 'app/practiceGame/dashboard/dashboard.tpl.html',label: 'Dashboard', resolve: {deps: function ($q, $rootScope) {
        var deferred = $q.defer(),
            essentials = [
                filePath.dashboard.dashServ,
                filePath.dashboard.dashCtrl
            ];
        $script(essentials, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            });
        });
        return deferred.promise;
    }},
    controller: 'DetailDashController',
    access: {
            authorizedRoles: [UserRoles.admin, UserRoles.member]
        }

    })


    .when('/:subject/practice', {templateUrl: 'app/practiceGame/practice/practice.tpl.html', label: 'More Detail', resolve: {deps: function ($q, $rootScope) {
        var deferred = $q.defer(),
            essentials = [
                filePath.practice.practiceCtrl,
                filePath.practice.practiceDrctv,
                filePath.practice.practiceServ,
                filePath.practice.youtube
            ];
        $script(essentials, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            });
        });

            return deferred.promise;
    }}, controller: 'PracticeController',
      access: {
          authorizedRoles: [UserRoles.admin, UserRoles.member]
      }
    });

        $routeProvider.otherwise({redirectTo:'/'});

});
