'use strict';
(function() {

  angular.module("grockitApp").run(run);
  run.$inject = ['$rootScope', 'Observable','appService'];

  function run($rootScope, Observable,appService) {

    var observable = Observable.create('isActiveNav');

    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      appService.userPreflight(observable);
    });
  }
}
(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'grockitApp.components',
  'grockitApp.analyticService',
  'grockitApp.application',
  'grockitApp.requests',
  'grockitApp.authServices',
  'grockitApp.practice',
  'grockitApp.practice.factories',
  'grockitApp.question',
  'grockitApp.history',
  'grockitApp.dashboard',
  'grockitApp.questionReview'
  ])));
