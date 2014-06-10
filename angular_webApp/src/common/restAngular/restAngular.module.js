 var request = angular.module("grockitApp.requests",['restangular']).config(function (RestangularProvider,$provide) {
     request.factory       = $provide.factory;
     RestangularProvider.setBaseUrl('http://grockit.apiary-mock.com/');
  //   RestangularProvider.setRequestSuffix('.json');
 });

