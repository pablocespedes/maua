 var request = angular.module("grockitApp.requests",['restangular']).config(function ($httpProvider,RestangularProvider,$provide) {
     request.factory       = $provide.factory;

     delete $httpProvider.defaults.headers.common["X-Requested-With"];
     $httpProvider.defaults.headers.common["Content-Type"] = 'application/json';
     $httpProvider.defaults.headers.common["Accept"] = 'application/json';

    //$httpProvider.defaults.headers.common.Authorization = 'Token token="BAh7CUkiD3Nlc3Npb25faWQGOgZFVEkiJTJmYzNiODVhN2M1YzE3YmU4YWRiZThlMDM1OWVkYjgwBjsAVEkiDHVzZXJfaWQGOwBGSSIpZTFhMmYyZDAtYzAwNS0wMTMwLTJmNzAtMTIzMTM5MGVmOTgxBjsAVEkiEF9jc3JmX3Rva2VuBjsARkkiMWMrRWZ3cFRTeTBaSGtNOWxGaVVYTENQQytFT1pMcFYrQzMwM3dMU1UvWFE9BjsARkkiDWxvY2F0aW9uBjsARkM6LUFjdGl2ZVN1cHBvcnQ6Okhhc2hXaXRoSW5kaWZmZXJlbnRBY2Nlc3N7CEkiD2NvbnRyb2xsZXIGOwBGSSIKbG9iYnkGOwBUSSILYWN0aW9uBjsARkkiDXByYWN0aWNlBjsAVEkiDWdyb3VwX2lkBjsARkkiCHNhdAY7AFQ"';


    RestangularProvider.setBaseUrl('http://api.staging.grockit.com');

 });

