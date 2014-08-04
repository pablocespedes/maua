(function(app) {
 app.config(function($httpProvider) {

    })
     .run(function ($rootScope, $location, Auth,Utilities,Alerts) {

         if (Auth.isLoggedIn()) {

             if ($location.path() === '/' || $location.path() === '/' + Utilities.getActiveGroup() || $location.path() == '' || angular.isDefined($location.search()._token)) {

                 Auth.getUpdateUserData().then(function (response) {
                     if (response != null) {

                         Utilities.redirect('#/' + Utilities.getActiveGroup() + '/dashboard');

                     }
                 }).catch(function error(error) {

                     Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
                 });

             }
         }
         else {

            //send to login page
         }

       /*  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                 event.preventDefault();

                 if(Auth.isLoggedIn()) {
                     Utilities.redirect('#/' + Utilities.getActiveGroup() + '/dashboard');
                 } else {
                     Utilities.redirect('#/development/setCookie');
                 }
         });*/


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



/*var oldSite = ($location.host == '127.0.0.1') ? Utilities.originalGrockit().url + '/login?redirect=' : '' + '/login?redirect=',
    newSite = Utilities.newGrockit().url;

if (Auth.isLoggedIn()) {

    if ($location.path() === '/' || $location.path() === '/' + Utilities.getActiveGroup() || $location.path() == '' || angular.isDefined($location.search()._token)) {

        Auth.getUpdateUserData().then(function (response) {
            if (response != null) {

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
        else {
            if ($location.path() == '' || $location.path() == '/') {
                newSite = newSite + '#/?' + '_token';
            }
            else {
                newSite = newSite + '/?' + '_token';
            }

            Utilities.encodeRedirect(oldSite, newSite);
        }
    }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
    });

}*/

