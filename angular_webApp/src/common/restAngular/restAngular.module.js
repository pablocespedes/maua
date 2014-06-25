 var request = angular.module("grockitApp.requests",['restangular']).config(function ($httpProvider,RestangularProvider,$provide) {

     request.factory       = $provide.factory;
     delete $httpProvider.defaults.headers.common["X-Requested-With"];
     $httpProvider.defaults.headers.common["Content-Type"] = 'application/json';
     $httpProvider.defaults.headers.common["Accept"] = 'application/json, text/html, text/plain';

     RestangularProvider.setFullResponse(true);
    RestangularProvider.setBaseUrl('http://api.staging.grockit.com');


 });

