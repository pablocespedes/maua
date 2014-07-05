
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



/*Custom request*/
request.factory("VideoService", function($q) {

    return{
        setYouTubeTitle: function(youtubeId) {
            var deferred = $q.defer();
            var url = "https://gdata.youtube.com/feeds/api/videos/" + youtubeId + "?v=2&alt=json";
            $.ajax({
                url: url,
                dataType: 'jsonp',
                cache: true,
                success: function (data){
                    var secs = data.entry.media$group.yt$duration.seconds,
                        hours = Math.floor(secs / (60 * 60)),
                        divisor_for_minutes = secs % (60 * 60),
                        minutes = Math.floor(divisor_for_minutes / 60),
                        divisor_for_seconds = divisor_for_minutes % 60,
                        seconds = Math.ceil(divisor_for_seconds),
                        time = (hours> 0 ? hours +':' : '') + (minutes>0 ? minutes+':' : '') + (seconds>0 ? seconds+' secs' :'');

                deferred.resolve(time);

                }
            });
            return deferred.promise;
        }
    }
});


