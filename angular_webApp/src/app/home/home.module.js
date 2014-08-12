'use strict';
var home =  angular.module("grockitApp.home",['ng-breadcrumbs']).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,UserRoles) {
  home.controller = $controllerProvider.register;
  home.directive = $compileProvider.directive;
  home.routeProvider = $routeProvider;
  home.factory = $provide.factory;
  home.service = $provide.service;

  var filePath = {
    trackDashboard: {
      dashCtrl: 'app/home/track-dashboard/dashboard.ctrl.js',
      dashServ: 'app/home/track-dashboard/dashboard.service.js'
    },
    dashboard: {
      dashCtrl: 'app/home/dashboard/sDashboard.ctrl.js',
      dashServ: 'app/home/dashboard/sDashboard.service.js'
    }
  };

  $routeProvider.when('/:subject/dashboard', {templateUrl: 'app/home/dashboard/dashboard.tpl.html', label: 'Dashboard', resolve: {deps: function ($q, $rootScope) {
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
    controller: 'SimpleDashController'
  })
  .when('/:subject/track-dashboard', {templateUrl: 'app/home/track-dashboard/dashboard.tpl.html', label: 'Dashboard', resolve: {deps: function ($q, $rootScope) {
      var deferred = $q.defer(),
        essentials = [
          filePath.trackDashboard.dashServ,
          filePath.trackDashboard.dashCtrl
        ];
      $script(essentials, function () {
        // all dependencies have now been loaded by $script.js so resolve the promise
        $rootScope.$apply(function () {
          deferred.resolve();
        });
      });
      return deferred.promise;
    }},
      controller: 'TrackDashController'
    });

});

