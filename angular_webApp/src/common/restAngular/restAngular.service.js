
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

request.factory('QuestionSets', function(Restangular) {
    return  Restangular.service('question_sets')

});


request.factory('Headers', function(Restangular,$cookies) {
    return  {
        setDefaultHeader:function(sessionId){

            Restangular.setDefaultHeaders({'Authorization':'Token token='+'"'+sessionId+'"'});

        },
        updateDefaultHeader:function(){

            Restangular.setDefaultHeaders({'Authorization':'Token token='+'"'+$cookies.authorization_token+'"'});

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




