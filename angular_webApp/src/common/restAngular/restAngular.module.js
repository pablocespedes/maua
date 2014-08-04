 var request = angular.module("grockitApp.requests",['restangular'])
     .config(function (RestangularProvider,$httpProvider,$provide) {

         var urlPattern = /http(s?)\:\/\/staging/.test(location.origin),
             url = urlPattern ? 'http://api.staging.grockit.com' : 'https://api.grockit.com';


         request.factory = $provide.factory;
         delete $httpProvider.defaults.headers.common["X-Requested-With"];
         $httpProvider.defaults.headers.common["Content-Type"] = 'application/json';
         $httpProvider.defaults.headers.common["Accept"] = 'application/json, text/html, text/plain';

         RestangularProvider.setFullResponse(true);
         RestangularProvider.setBaseUrl(url);
         RestangularProvider.setDefaultRequestParams({ 'timeStamp': new Date().getTime() });


     });

