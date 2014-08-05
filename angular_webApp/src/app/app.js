(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Utilities,Alerts) {

         if (Auth.isLoggedIn()) {

            // if ($location.path() === '/' || $location.path() === '/' + Utilities.getActiveGroup() || $location.path() == '') {

                 Auth.getUpdateUserData().then(function (response) {
                     if (response != null) {

                         Utilities.redirect('#/' + Utilities.getActiveGroup() + '/dashboard');

                     }
                 }).catch(function error(error) {

                     Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
                 });

             //}
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

