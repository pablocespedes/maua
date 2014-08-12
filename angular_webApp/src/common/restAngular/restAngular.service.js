
request.factory('Users', function(Restangular,Headers) {
  Headers.updateDefaultHeader();

  function getUser(){
    var users = Restangular.service('users');

    return {
      self: function(){
       return  users.one('self').get();
     },
     scorePrediction: function(userId,activeGroupId) {

      return users.one().one(userId).customGET('score_prediction', {group: activeGroupId});
    },
    history: function(userId,activeGroupId,trackId) {
      return  users.one().one(userId).customGET('history', {group: activeGroupId, trackId:trackId});
    }
  }
}

return {
  getUser:getUser
}

});

request.factory('practiceRequests', function(Restangular,Headers) {
  Headers.updateDefaultHeader();

  function practiceGames() {

    var restPracticeGameObject = Restangular.service('practice_games').one();

    return {
      getQuestionNewSetByPractice: function (practiceGameId, tracks) {
        return  restPracticeGameObject.one(practiceGameId, 'sample').customGET('', {'tracks[]': tracks});
      },
      createNewPracticeGame: function (activeGroupId) {
        return  restPracticeGameObject.post('', {group_id: activeGroupId});
      }
    }
  }

  function roundSessions(){
    var roundSessionObject=  Restangular.service('round_sessions').one();

    return{
      createQuestionPresentation : function(gameId,questionId){

        return roundSessionObject.post('', {game_id: gameId, question_id: questionId});
      },
      updateAnswer: function(roundSessionAnswerId,answerId){
        roundSessionObject.one(roundSessionAnswerId).put({answer_id: answerId});
      }
    }
  }

  function questionSets() {
    var questionSetObject = Restangular.service('question_sets').one();

    return{
      getQuestionSetById: function (questionSetId) {
        return  questionSetObject.one(questionSetId).customGET('');
      }
    }
  }

  function questions(){
    var questionObject = Restangular.service('questions').one();

    return  {
      getQuestionById: function(questionId){
        return  questionObject.one(questionId).customGET('');
      }
    }
  }

  return  {
    practiceGames :  practiceGames,
    roundSessions: roundSessions,
    questionSets: questionSets,
    questions: questions

  }

});

request.factory('Groups', function(Restangular,Headers) {
  Headers.updateDefaultHeader();

  function getGroups(){
    var groups = Restangular.service('groups').one();

    return {
      membershipGroups: function(){
        return groups.customGET('',{subdomain : 'www'});
      }
    }
  }

  return {
    getGroups:getGroups
  }


});

request.factory('Tracks', function(Restangular,Headers) {
  Headers.updateDefaultHeader();
  function getTracks(){
    var tracks =  Restangular.service('tracks').one(), trackData=null;

    return {
      allByGroup: function(groupId,shouldUpdate){
        trackData = trackData==null || shouldUpdate ? tracks.customGET('', {group_id: groupId}) : trackData;
        return trackData;
      }
    }
  }

  return {
    getTracks:getTracks
  }

});



request.factory('Headers', function(Restangular) {


  return  {
    setDefaultHeader: function(sessionId) {
      Restangular.setDefaultHeaders({'Authorization':'Token token=' + '"' + sessionId + '="'});
    },

    updateDefaultHeader: function() {
      var sessionId = decodeURIComponent(this.getCookie("authentication_token"));
      this.setDefaultHeader(sessionId);
    },
    getCookie :function(key) {
      var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
      return keyValue ? keyValue[2] : null;
    }

  }
});



/*Custom request*/
request.factory("VideoService", function($q) {

		return{
				setYouTubeTitle: function (youtubeId) {
						var deferred = $q.defer();
						var url = "https://gdata.youtube.com/feeds/api/videos/" + youtubeId + "?v=2&alt=json";
						$.ajax({
								url: url,
								dataType: 'jsonp',
								cache: true,
								success: function (data) {
										var secs = data.entry.media$group.yt$duration.seconds,
										hours = Math.floor(secs / (60 * 60)),
										divisor_for_minutes = secs % (60 * 60),
										minutes = Math.floor(divisor_for_minutes / 60),
										divisor_for_seconds = divisor_for_minutes % 60,
										seconds = Math.ceil(divisor_for_seconds);

										if (hours < 10) {
												hours = "0" + hours;
										}
										if (minutes < 10) {
												minutes = "0" + minutes;
										}
										if (seconds < 10) {
												seconds = "0" + seconds;
										}
										// var time    = hours+':'+minutes+':'+seconds;

										var time = (hours > 0 ? hours + ':' : '') + (minutes > 0 ? minutes + ':' : '') + (seconds > 0 ? seconds + ' secs' : '');

										deferred.resolve(time);

								}
						});
						return deferred.promise;
				}
		}
});

