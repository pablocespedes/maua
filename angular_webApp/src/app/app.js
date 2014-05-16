(function(app) {
    app.config(function ($routeProvider) {

        $routeProvider.otherwise({redirectTo: '/home'});

    });
    app.run(function () {});
}(angular.module("gRockitApp", [
        'ngResource',
        'ngRoute',
        'gRockitApp.home',
        'gRockitApp.practice'
    ])));

