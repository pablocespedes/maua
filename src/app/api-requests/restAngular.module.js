angular.module("grockitApp.requests",['restangular'])
.config(function (RestangularProvider,$httpProvider,$provide,environmentCons) {

  var urlPattern = /http(s?)\:\/\/staging/.test(location.origin),
  url = !urlPattern ? environmentCons.stagingAPI : environmentCons.liveAPI;


  angular.module("grockitApp.requests").factory = $provide.factory;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Content-Type"] = 'application/json';
  $httpProvider.defaults.headers.common["Accept"] = 'application/json, text/html, text/plain';

  RestangularProvider.setFullResponse(true);
  RestangularProvider.setBaseUrl(url);
  RestangularProvider.setDefaultRequestParams({ 'timeStamp': new Date().getTime() });


});

