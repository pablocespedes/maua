'use strict';
(function(app) {
 app.config(function($routeProvider) {

        $routeProvider.otherwise({redirectTo: '/dashboard'});
    });
    app.run(function () {});
}(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'grockitApp.requests',
  'grockitApp.practice',
  'grockitApp.home'
]))
);

