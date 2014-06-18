'use strict';
(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Groups,Utilities) {

     $rootScope.$on("$routeChangeStart", function (event, next) {
         var oldSite='',newSite='';
         if (!Auth.authorize(next)) {

             if(Auth.isLoggedIn()){
                 Groups.getActiveGroup();

                 if ($location.path() == '' ||  angular.isDefined($location.search()._app_server_session)) {

                     Utilities.redirect('#/' + Groups.getActiveGroup() + '/dashboard');
                 }
             }
             else {

                 Auth.setCurrentUser().then(function (userData) {
                     if (angular.isDefined(userData)) {
                         $rootScope.$broadcast("init");
                         window.location.href = '#/' + userData.studyingFor + "/dashboard";

                     } else {
                             oldSite = 'https://staging.grockit.com/login?redirect=';
                         if ($location.path() == ''){
                             newSite = $location.absUrl() + '#/?'+'_app_server_session';
                         }
                         else{
                             newSite = $location.absUrl() + '/?'+'_app_server_session';
                         }

                         Utilities.encodeRedirect(oldSite, newSite);
                     }

                 });
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
  'grockitApp.home',
  'grockitApp.account',
   'grockitApp.directives'
]))
);

