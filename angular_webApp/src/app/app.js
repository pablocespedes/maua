(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Utilities,Alerts) {
         if(Auth.isLoggedIn()) {

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

                     Utilities.redirect('#/' + Utilities.getActiveGroup() + "/dashboard");
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
  'ngCookies',
  'grockitApp.services',
  'grockitApp.requests',
  'grockitApp.authServices',
  'grockitApp.listenloopService',
  'grockitApp.practiceGame',
  'grockitApp.home',
  'grockitApp.directives'
]))
);

