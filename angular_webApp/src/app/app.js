(function(app) {
 app.config(function($httpProvider) {

 })
 .run(function ($rootScope, $location, Auth,Utilities,Alerts) {
     if (Auth.isLoggedIn()) {
       Auth.getUpdateUserData().then(function (response) {

         if (response != null) {
           if ($location.path() === '/' || $location.path() === '/' + response.currentGroup || $location.path() == '') {

             Utilities.redirect('#/' + response.currentGroup+ '/dashboard');

           }
         }

       }).catch(function error(error) {
         Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
       });
     }
     else {
       $rootScope.$destroy();
       $("body").html('The user is not logged in! <a href=\"/logout\">Click here to restart</a>.');
     }
   });
}(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'grockitApp.services',
  'grockitApp.requests',
  'grockitApp.authServices',
  'grockitApp.analyticService',
  'grockitApp.practiceGame',
  'grockitApp.home',
  'grockitApp.directives'
  ]))
);

