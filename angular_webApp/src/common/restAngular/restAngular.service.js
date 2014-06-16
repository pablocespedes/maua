
request.factory('Users', function(Restangular) {
    return  Restangular.service('users')

});

request.factory('Questions', function(Restangular) {
    return  Restangular.service('questions')

});

request.factory('Tracks', function(Restangular) {
    return  Restangular.service('tracks')

});

request.factory('PracticeGames', function(Restangular) {
    return  Restangular.service('practice_games')

});


request.factory('Headers', function(Restangular) {
    return  {
        setDefaultHeader:function(sessionId){
            Restangular.setDefaultHeaders({'Authorization':'Token token='+sessionId+""});

        },
        removeDefaultHeader: function(){
            Restangular.setDefaultHeaders({'Authorization':''})
        }
    }
});










request.factory('ApiV3Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://staging.grockit.com/api/v3/');
        RestangularConfigurer.setRequestSuffix('.json');
    });
});

request.factory('Questions', function(ApiV3Restangular) {

    return ApiV3Restangular.service('questions');

});




