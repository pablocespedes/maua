'use strict';
 angular.module("grockitApp.dashboard",['ng-breadcrumbs','ui.bootstrap','ui.accordion']).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,UserRoles) {
  angular.module('grockitApp.dashboard').controller = $controllerProvider.register;
  angular.module('grockitApp.dashboard').routeProvider = $routeProvider;
  angular.module('grockitApp.dashboard').factory = $provide.factory;
  angular.module('grockitApp.dashboard').service = $provide.service;

  var filePath = {
    dashboard: {
      dashCtrl: 'app/dashboard/sDashboard.ctrl.js',
      dashServ: 'app/dashboard/sDashboard.service.js',
      dashDirect: 'app/components/dashboard/dashboard.directive.js'
    }
  };

  $routeProvider.when('/:subject/dashboard', {templateUrl: 'app/dashboard/dashboard.tpl.html', label: 'Dashboard', resolve: {deps: function ($q, $rootScope) {
    var deferred = $q.defer(),
      essentials = [
        filePath.dashboard.dashDirect,
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
    controllerAs: 'vmDash'
  });

//$routeProvider.otherwise({ redirectTo: '/gmat/dashboard' })

});

