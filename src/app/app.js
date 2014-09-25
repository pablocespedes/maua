'use strict';
(function(app) {

  app.run(run);
  run.$inject = ['$rootScope', '$location', '$window', 'Auth', 'utilities', 'alerts', 'GroupsApi', 'currentProduct'];

  function run($rootScope, $location, $window, Auth, utilities, alerts, GroupsApi, currentProduct) {

    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      if (Auth.isLoggedIn()) {

        Auth.getUpdateUserData().then(function(response) {

          if (response != null) {
            GroupsApi.membershipGroups(true).then(function(result) {
              var groups = result.data.groups;
              if ($location.path() === '/' || $location.path() === '/' + response.currentGroup || $location.path() == '') {
                utilities.internalRedirect('/' + response.currentGroup + '/dashboard');
              } else {
                var urlGroup = utilities.getCurrentParam('subject'),
                actualGroup = _.find(groups, {
                  'id': urlGroup
                });

                if (angular.isUndefined(actualGroup)) {
                  $window.location = '404.html';
                } else {
                  //if(utilities.getActiveGroup()!==urlGroup)
                    currentProduct.currentGroupId(urlGroup,actualGroup);

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
  'grockitApp.dashboard'
  ])));
