DevController = function($rootScope,$scope,Auth,$route) {

 $rootScope.isDev=true;

 $scope.setToken = function(){
   Auth.setToken('_app_server_session',angular.element('#cookie').val());
     $route.reload();
 }

};


