'use strict';
(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Utilities,Alerts) {
         var errorMsg='';
         if(Auth.isLoggedIn()) {
             Utilities.getActiveGroup();

             if ($location.path() === '/' || $location.path() === '/' + Utilities.getActiveGroup() || $location.path() == '' || angular.isDefined($location.search()._token)) {

                 Auth.getUpdateUserData().then(function(response) {
                     if(response!=null){

                         Utilities.redirect('#/' + Utilities.getActiveGroup() + '/dashboard');

                     }
                 }).catch(function error(error) {

                     Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
                 });

             }
         }
         else {

             Auth.setCurrentUser().then(function (userData) {
                 if (angular.isDefined(userData)) {

                     $rootScope.$broadcast("init");
                     Utilities.redirect('#/' + userData.studyingFor + "/dashboard");
                 }
             }).catch(function error(error) {

                 Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
             });

         }

});
}(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'ngCookies',
  'grockitApp.services',
  'grockitApp.requests',
  'grockitApp.authServices',
  'grockitApp.practiceGame',
  'grockitApp.home',
   'grockitApp.directives'
]))
);

