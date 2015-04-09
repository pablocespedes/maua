'use strict';
(function() {

    angular.module("grockitApp")
      .value('fakeUserIntercom', {
        email: 'john.doe@example.com',
        name: 'John Doe',
        created_at: 1234567890,
        user_id: '9876'
      })
      .constant('IntercomAppId', 'lfqlzjgt')
      .config(mainConfig)
      .run(run);
    mainConfig.$inject = ['$intercomProvider', 'IntercomAppId'];
    run.$inject = ['$rootScope', '$location', '$intercom', 'appService','fakeUserIntercom'];


    function run($rootScope, $location, $intercom, appService,fakeUserIntercom) {
      $intercom.boot(fakeUserIntercom);
      $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
        appService.userPreflight(event);
      });
    }

    function mainConfig($intercomProvider, IntercomAppId) {

      $intercomProvider
        .appID(IntercomAppId);

      $intercomProvider
        .asyncLoading(true)
    }

  }
  (angular.module("grockitApp", [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngCookies',
    'ngIntercom',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ng.deviceDetector',
    'grockitApp.application',
    'grockitApp.components',
    'grockitApp.analyticService',
    'grockitApp.requests',
    'grockitApp.authServices',
    'grockitApp.practice',
    'grockitApp.practice.services',
    'grockitApp.question',
    'grockitApp.history',
    'grockitApp.dashboard',
    'grockitApp.questionReview'
  ])));
