'use strict';
(function() {

  angular.module("grockitApp").run(run);
  run.$inject = ['$rootScope', '$location','appService'];

  function run($rootScope, $location,appService) {
    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      appService.userPreflight(event);
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
