 var request = angular.module("grockitApp.requests",['restangular']).config(function (RestangularProvider,$provide) {
     request.factory       = $provide.factory;
     RestangularProvider.setBaseUrl('http://api.staging.grockit.com/');
     RestangularProvider.setRequestSuffix('.json');
 });

