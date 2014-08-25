'use strict';

var practiceGame =  angular.module("grockitApp.practiceGame",['ng-breadcrumbs'])
    .config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide) {
    practiceGame.controller = $controllerProvider.register;
    practiceGame.directive = $compileProvider.directive;
    practiceGame.routeProvider = $routeProvider;
    practiceGame.factory = $provide.factory;
    practiceGame.service = $provide.service;

    var filePath = {
      common:{
        practiceDct: 'app/practiceGame/common/practice.directive.js',
        practiceSrv: 'app/practiceGame/common/practice.service.js',
        youtube: 'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
      },
      question:{
        questionCtrl: 'app/practiceGame/question/question.ctrl.js'
      },
      customPractice:{
        practiceCtrl: 'app/practiceGame/custom-practice/customPractice.ctrl.js'
      }
    };


    $routeProvider.when('/:subject/question/:questionId', {templateUrl: 'app/practiceGame/question/question.tpl.html',
      label: 'practice',
      resolve: {deps: function ($q, $rootScope) {
        var deferred = $q.defer(),
          essentials = [
            filePath.question.questionCtrl,
            filePath.common.practiceDct,
            filePath.common.practiceSrv,
            filePath.common.youtube
          ];
        $script(essentials, function () {
          $rootScope.$apply(function () {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }}, controller: 'QuestionController',
      reloadOnSearch: false
    })

    .when('/:subject/custom-practice', {templateUrl: 'app/practiceGame/custom-practice/customPractice.tpl.html',
      label: 'practice',
      resolve: {deps: function ($q, $rootScope) {
        var deferred = $q.defer(),
          essentials = [
            filePath.customPractice.practiceCtrl,
            filePath.common.practiceDct,
            filePath.common.practiceSrv,
            filePath.common.youtube
          ];
        $script(essentials, function () {
          $rootScope.$apply(function () {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }}, controller: 'CustomPracticeController',
      reloadOnSearch: false
    });



  });
