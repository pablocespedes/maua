'use strict';
(function() {

  angular.module("grockitApp").run(run);
  run.$inject = ['$rootScope', '$location', '$window', 'Auth', 'utilities', 'alerts', 'GroupsApi', 'currentProduct', 'Observable', 'membershipService'];

  function run($rootScope, $location, $window, Auth, utilities, alerts, GroupsApi, currentProduct, Observable, membershipService) {

    var observable = Observable.create('isActiveNav');

    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      if (Auth.isLoggedIn()) {

        Auth.getUpdateUserData().then(function(userResponse) {

          if (userResponse != null) {
            observable.notify($location.path());
            GroupsApi.membershipGroups(true).then(function(result) {
              var groups = result.data.groups;
              if ($location.path() === '/' || $location.path() === '/' + userResponse.currentGroup || $location.path() == '') {
                utilities.internalRedirect('/' + userResponse.currentGroup + '/dashboard');
              } else {

                var urlGroup = utilities.getCurrentParam('subject'),
                actualGroup = _.find(groups, {
                  'id': urlGroup
                }),
                userGroup = _.find(userResponse.groupMemberships, {
                  'group_id': urlGroup
                });


                if (angular.isUndefined(actualGroup) || angular.isUndefined(userGroup)) {
                  $window.location = '404.html';
                } else {
                  membershipService.setMembershipInfo(userResponse,userGroup, urlGroup);
                  membershipService.userCanAccesPage(urlGroup);
                   currentProduct.currentGroupId(urlGroup, actualGroup);

                }
              }
            });
          }

        }).catch(function errorHandler(e) {
          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });

      } else {
        $("body").html('The user is not logged in! <a href=\"/logout\">Click here to restart</a>.');
        event.preventDefault();

      }
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
