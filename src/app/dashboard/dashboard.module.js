(function() {
  'use strict';
  angular.module("grockitApp.dashboard", ['ng-breadcrumbs'])
  .config(config);
  config.$inject = ['$routeProvider','$controllerProvider','$compileProvider','$provide'];

  function config($routeProvider,$controllerProvider,$compileProvider,$provide) {
    angular.module("grockitApp.dashboard").controller = $controllerProvider.register;
    angular.module("grockitApp.dashboard").directive = $compileProvider.directive;
    angular.module("grockitApp.dashboard").routeProvider = $routeProvider;
   angular.module("grockitApp.dashboard").factory= $provide.factory;
  angular.module("grockitApp.dashboard").service = $provide.service;

    var filePath = {
      dashboard: {
        dashCtrl: 'app/dashboard/sDashboard.ctrl.js',
        dashServ: 'app/dashboard/sDashboard.service.js',
        dashDirect: 'app/components/dashboard/dashboard.directive.js'
      }
    };

    $routeProvider.when('/:subject/dashboard', {
      templateUrl: 'app/dashboard/dashboard.tpl.html',
      label: 'Dashboard',
      resolve: {
        deps: function($q, $rootScope) {
          var deferred = $q.defer(),
          essentials = [
          filePath.dashboard.dashCtrl,
          filePath.dashboard.dashDirect,
          filePath.dashboard.dashServ
          ];
          $script(essentials, function() {
            $rootScope.$apply(function() {
              deferred.resolve();
            });
          });
          return deferred.promise;
        }
      },
      controller: 'SimpleDashController',
      controllerAs: 'vmDash'
    });
  }

})();
