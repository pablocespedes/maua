'use strict';
(function(app) {
    app.config(function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/home'});
    });
    app.run(function () {});
}(angular.module("grockitApp", [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'grockitApp.requests',
  'grockitApp.home',
  'grockitApp.practice'
]))
);

