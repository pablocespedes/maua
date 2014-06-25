'use strict';
(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Utilities) {

     $rootScope.$on("$routeChangeStart", function (event, next) {
         var oldSite='',newSite='';

             oldSite=Utilities.originalGrockit().url+'/login?redirect=';
             newSite= Utilities.newGrockit().url;

         if (!Auth.authorize(next)) {

             if(Auth.isLoggedIn()){
                 Utilities.getActiveGroup();

                 if ($location.path() == '' || angular.isDefined($location.search()._token)) {

                     Utilities.redirect('#/' + Utilities.getActiveGroup() + '/dashboard');
                 }
             }
             else {

                 Auth.setCurrentUser().then(function (userData) {
                     if (angular.isDefined(userData)) {
                         $rootScope.$broadcast("init");
                         Utilities.redirect('#/' + userData.studyingFor + "/dashboard");

                     } else {

                         if ($location.path() == ''){
                             newSite = newSite+ '#/?'+'_token';
                         }
                         else{
                             newSite = newSite+ '/?'+'_token';
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
   'grockitApp.directives'
]))
);

