(function(app) {
    app.config(function ($routeProvider) {
        var filePath = {
            home: 'app/home/home.ctrl.js'
        }


        $routeProvider.when('/home', {templateUrl: 'app/home/home.tpl.html', resolve:{deps:function($q, $rootScope){
            var deferred = $q.defer();
            var essentials = [ filePath.home ];
            $script(essentials,function(){
                    // all dependencies have now been loaded by $script.js so resolve the promise
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
            });
            return deferred.promise;
        }}});
    });
    app.run(function () {});
}(angular.module("gRockitApp", [
        'ngResource',
        'ngRoute',
        'gRockitApp.home',
        'gRockitApp.practice'
    ])));

