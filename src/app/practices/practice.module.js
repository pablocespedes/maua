'use strict';

 angular.module("grockitApp.practice", ['ng-breadcrumbs'])
.config(function($httpProvider, $routeProvider, $controllerProvider, $compileProvider, $provide) {
  angular.module("grockitApp.practice").controller = $controllerProvider.register;
  angular.module("grockitApp.practice").directive = $compileProvider.directive;
  angular.module("grockitApp.practice").routeProvider = $routeProvider;
  angular.module("grockitApp.practice").factory = $provide.factory;
  angular.module("grockitApp.practice").service = $provide.service;

  var filePath = {
    common: {
      questTypesDct: 'app/components/question-types/questionsT.directive.js',
      practiceDct: 'app/components/practice/practice.directive.js',
      practiceSrv: 'app/shared/services/practice.service.js',
      youtube: 'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
    },
    customPractice: {
      practiceCtrl: 'app/practices/practice.ctrl.js'
    }
  };


  $routeProvider.when('/:subject/custom-practice', {
    templateUrl: 'app/practices/practice.tpl.html',
    label: 'practice',
    resolve: {
      deps: function($q, $rootScope) {
        var deferred = $q.defer(),
        essentials = [
        filePath.common.practiceDct,
        filePath.common.questTypesDct,
        filePath.customPractice.practiceCtrl,
        filePath.common.practiceSrv,
        filePath.common.youtube
        ];
        $script(essentials, function() {
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }
    },
    controller: 'CustomPracticeController',
    controllerAs: 'vmPr'
  });



});
