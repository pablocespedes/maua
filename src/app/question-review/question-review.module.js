'use strict';

angular.module("grockitApp.questionReview", ['ng-breadcrumbs'])
.config(function($httpProvider, $routeProvider, $controllerProvider, $compileProvider, $provide) {
  angular.module("grockitApp.questionReview").controller = $controllerProvider.register;
  angular.module("grockitApp.questionReview").routeProvider = $routeProvider;
  angular.module("grockitApp.questionReview").service = $provide.service;

  var filePath = {
    common: {
      questTypesDct: 'app/components/question-types/questionsT.directive.js',
      practiceDct: 'app/components/practice/practice.directive.js',
      practiceSrv: 'app/shared/services/practice.service.js',
      youtube: 'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
    },
    question: {
      reviewCtrl: 'app/question-review/question-review.ctrl.js'
    }
  };


  $routeProvider.when('/:subject/review/:rounSessionId', {
    templateUrl: 'app/question-review/question-review.tpl.html',
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
