'use strict';

angular.module("grockitApp.question", ['ng-breadcrumbs'])
.config(function($httpProvider, $routeProvider, $controllerProvider, $compileProvider, $provide) {
  angular.module("grockitApp.question").controller = $controllerProvider.register;
  angular.module("grockitApp.question").directive = $compileProvider.directive;
  angular.module("grockitApp.question").routeProvider = $routeProvider;
  angular.module("grockitApp.question").factory = $provide.factory;
  angular.module("grockitApp.question").service = $provide.service;

  var filePath = {
    common: {
      questTypesDct: 'app/components/question-types/questionsT.directive.js',
      practiceDct: 'app/components/practice/practice.directive.js',
      practiceSrv: 'app/shared/services/practice.service.js',
      youtube: 'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
    },
    question: {
      questionCtrl: 'app/questions/question.ctrl.js',
      reviewCtrl: 'app/questions/review.ctrl.js'
    }
  };


  $routeProvider.when('/:subject/questions/:questionId', {
    templateUrl: 'app/questions/question.tpl.html',
    label: 'Question View',
    resolve: {
      deps: function($q, $rootScope) {
        var deferred = $q.defer(),
        essentials = [
        filePath.common.questTypesDct,
        filePath.common.practiceDct,
        filePath.question.questionCtrl,
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
    controller: 'QuestionController',
    controllerAs: 'vmPr'
  })
  .when('/:subject/review/:rounSessionId', {
    templateUrl: 'app/questions/review.tpl.html',
    label: 'Question Review',
    resolve: {
      deps: function($q, $rootScope) {
        var deferred = $q.defer(),
        essentials = [
        filePath.common.questTypesDct,
        filePath.common.practiceDct,
        filePath.question.reviewCtrl,
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
    controller: 'ReviewController',
    controllerAs: 'vmPr'
  });



});
