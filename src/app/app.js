'use strict';
(function() {

  angular.module("grockitApp").run(run);
  run.$inject = ['$rootScope', '$location','appService'];

  function run($rootScope, $location,appService) {
    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      console.log('user preflight')
      appService.userPreflight(event);
    });
  }
}
(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'ng.deviceDetector',
  'grockitApp.components',
  'grockitApp.analyticService',
  'grockitApp.application',
  'grockitApp.requests',
  'grockitApp.authServices',
  'grockitApp.practice',
  'grockitApp.practice.services',
  'grockitApp.question',
  'grockitApp.history',
  'grockitApp.dashboard',
  'grockitApp.questionReview'
  ])));
