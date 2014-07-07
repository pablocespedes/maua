'use strict';
(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Utilities) {

         if(Auth.isLoggedIn()) {
             Utilities.getActiveGroup();

             if ($location.path() === '/' || $location.path() === '/' + Utilities.getActiveGroup() || $location.path() == '' || angular.isDefined($location.search()._token)) {

                 Auth.getUpdateUserData().then(function(response) {
                     if(response!=null){

                         Utilities.redirect('#/' + Utilities.getActiveGroup() + '/dashboard');

                     }
                 });

             }
         }
         else {

             Auth.setCurrentUser().then(function (userData) {
                 if (angular.isDefined(userData)) {

                     $rootScope.$broadcast("init");
                     Utilities.redirect('#/' + userData.studyingFor + "/dashboard");
                 }
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

