'use strict';

var practiceGame =  angular.module("grockitApp.practiceGame",['ng-breadcrumbs'])
    .config(function ($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,UserRoles) {
    practiceGame.controller = $controllerProvider.register;
    practiceGame.directive = $compileProvider.directive;
    practiceGame.routeProvider = $routeProvider;
    practiceGame.factory = $provide.factory;
    practiceGame.service = $provide.service;

    var filePath = {
      practice: {
        practiceCtrl: 'app/practiceGame/practice/practice.ctrl.js',
        practiceDrctv: 'app/practiceGame/practice/practice.directive.js',
        practiceServ: 'app/practiceGame/practice/practice.service.js',
        youtube: 'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
      },
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

    $routeProvider.when('/:subject/dashboard/practice/:questionId', {templateUrl: 'app/practiceGame/practice/practice.tpl.html',
      label: 'practice',
      resolve: {deps: function ($q, $rootScope) {
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
      reloadOnSearch: false
    })

    .when('/:subject/question/:questionId', {templateUrl: 'app/practiceGame/question/question.tpl.html',
      label: 'practice',
      resolve: {deps: function ($q, $rootScope) {
        var deferred = $q.defer(),
          essentials = [
            filePath.question.questionCtrl,
            filePath.common.practiceDrctv,
            filePath.common.practiceServ,
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
            filePath.common.practiceDrctv,
            filePath.common.practiceServ,
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
