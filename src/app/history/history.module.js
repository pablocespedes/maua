'use strict';

angular.module("grockitApp.history", ['ng-breadcrumbs'])
.config(function($httpProvider, $routeProvider, $controllerProvider, $compileProvider, $provide) {
  angular.module("grockitApp.question").controller = $controllerProvider.register;
  angular.module("grockitApp.question").directive = $compileProvider.directive;
  angular.module("grockitApp.question").routeProvider = $routeProvider;


  var filePath = {
    common: {
      practiceDct: '',
    }
  };


  $routeProvider.when('/:subject/history', {
    templateUrl: '',
    label: 'history',
    resolve: {
      deps: function($q, $rootScope) {
        var deferred = $q.defer(),
        essentials = [

        ];
        $script(essentials, function() {
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }
    },
    controller: 'HistoryController',
    controllerAs: 'vmHist'
  });



});
