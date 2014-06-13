'use strict';
(function(app) {
 app.config(function() {
    })
    .run(function ($rootScope,$location,generalServices, authService) {

         $rootScope.activeGroupId = generalServices.isGroupActive();

         $rootScope.$on('$routeChangeStart', function (event, next) {

             if (authService.isAuthenticated()) {

                 // user authenticated
                 event.preventDefault();
                 var authorizedRoles = next.data.authorizedRoles;
                 if (!authService.isAuthorized(authorizedRoles)) {

                 } else {
                     // user is not logged in
                     window.location.href = "http://staging.grockit.com/login?redirect=http%3A%2F%2F127.0.0.1%3A9000%2F%23%2Fsat%2Fdashboard%3F_app_server_session";
                 }
             }
             else {
                // search for session in the url hay una variable en la url
                 if(!authService.verifySessionURL()){

                     window.location.href = "http://staging.grockit.com/login?redirect=http%3A%2F%2F127.0.0.1%3A9000%2F%23%2Fsat%2Fdashboard%3F_app_server_session";
                     return false;
                 }


             }

         });

     });
}(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'ngCookies',
  'grockitApp.requests',
  'grockitApp.services',
  'grockitApp.authServices',
  'grockitApp.practiceGame',
  'grockitApp.home'
]))
);

