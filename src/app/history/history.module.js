(function() {
  'use strict';

  angular.module("grockitApp.history", ['ng-breadcrumbs'])
    .config(config);
  config.$inject = ['$routeProvider', '$controllerProvider', '$compileProvider', '$provide'];

  function config($routeProvider, $controllerProvider, $compileProvider, $provide) {

    angular.module("grockitApp.history").controller = $controllerProvider.register;
    angular.module("grockitApp.history").directive = $compileProvider.directive;
    angular.module("grockitApp.history").routeProvider = $routeProvider;
    angular.module("grockitApp.history").factory = $provide.factory;
    angular.module('grockitApp.history').service = $provide.service;

    var filePath = {
      history: {
        controllers: 'app/history/history.ctrl.js',
        services: 'app/history/history.service.js',
        directives: 'app/components/history/history.directive.js'
      }
    };

    $routeProvider.when('/:subject/history', {
      templateUrl: 'app/history/history.tpl.html',
      label: 'History',
      resolve: {
        deps: function($q, $rootScope) {
          var deferred = $q.defer(),
            essentials = [
              filePath.history.services
            ],
            dependencies = [
              filePath.history.controllers,
              filePath.history.directives
            ];


          $script(essentials, function() {
            $script(dependencies, function() {
              $rootScope.$apply(function() {
                deferred.resolve();
              });
            });
          });

          return deferred.promise;
        }
      },
      controller: 'HistoryController',
      controllerAs: 'vmHist'
    });

  }

})();
