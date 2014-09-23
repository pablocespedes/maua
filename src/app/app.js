'use strict';
(function(app) {
 app.config(function($routeProvider) {
 })
 .run(function ($rootScope, $location, Auth,utilities,alerts) {

   $rootScope.$on("$locationChangeStart", function(event, next, current) {

     if (Auth.isLoggedIn()) {

       Auth.getUpdateUserData().then(function (response) {

         if (response != null) {
           if ($location.path() === '/' || $location.path() === '/' + response.currentGroup || $location.path() == '') {

            utilities.internalRedirect('/' + response.currentGroup+ '/dashboard');
          }
        }

      }).catch(function errorHandler(e) {
       alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
     });

    }
    else {
     $("body").html('The user is not logged in! <a href=\"/logout\">Click here to restart</a>.');
     event.preventDefault();

   }
 });


 });
}(angular.module("grockitApp", [
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
  'grockitApp.dashboard'
  ]))
);

