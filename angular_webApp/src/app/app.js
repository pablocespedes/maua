'use strict';
(function(app) {
 app.config(function($routeProvider) {

    })
    .run(function ($rootScope,$location,generalServices) {
         $rootScope.$on('$routeChangeSuccess', function () {
             var groupIdSelected = generalServices.isGroupActive();
             $location.path('/'+groupIdSelected+ '/dashboard');
         });

    });
}(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'ngCookies',
  'grockitApp.services',
  'grockitApp.requests',
  'grockitApp.practiceGame',
  'grockitApp.home'
]))
);

