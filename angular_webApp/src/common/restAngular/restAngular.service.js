
request.factory('Users', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('users')

});


request.factory('Questions', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('questions')

});

request.factory('Groups', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('groups')

});

request.factory('Tracks', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('tracks')

});

request.factory('SubTracks', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('subtracks')

});

request.factory('PracticeGames', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('practice_games')

});

request.factory('RoundSessions', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
    return  Restangular.service('round_sessions')

});


request.factory('QuestionSets', function(Restangular,Headers) {
    Headers.updateDefaultHeader();
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


