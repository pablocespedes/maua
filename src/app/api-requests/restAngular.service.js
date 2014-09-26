(function() {
  'use strict';
  angular
  .module('grockitApp.requests')
  .factory('Headers', Headers)
  .factory('UsersApi', UsersApi)
  .factory('PracticeApi', PracticeApi)
  .factory('HistoryApi', HistoryApi)
  .factory('GroupsApi', GroupsApi)
  .factory('TracksApi', TracksApi)
  .factory('YoutubeVideoApi', YoutubeVideoApi)
  .factory('ChallengeApi', ChallengeApi)

  Headers.$inject = ['Restangular'];
  UsersApi.$inject = ['Restangular', 'Headers'];
  PracticeApi.$inject = ['Restangular', 'Headers'];
  HistoryApi.$inject = ['Restangular', 'Headers'];
  GroupsApi.$inject = ['Restangular', 'Headers'];
  TracksApi.$inject = ['Restangular', 'Headers'];
  YoutubeVideoApi.$inject = ['$q', 'environmentCons'];
  ChallengeApi.$inject = ['Restangular', 'Headers'];


  function Headers(Restangular) {

    var service = {
      setDefaultHeader:setDefaultHeader,
      updateDefaultHeader: updateDefaultHeader,
      getCookie: getCookie
    };

    return service;


    function setDefaultHeader(sessionId) {
      Restangular.setDefaultHeaders({
        'Authorization': 'Token token=' + '"' + sessionId + '="'
      });
    }

    function updateDefaultHeader() {
      var sessionId = decodeURIComponent(this.getCookie("authentication_token"));
      this.setDefaultHeader(sessionId);
    }

    function getCookie(key) {
      var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
      return keyValue ? keyValue[2] : null;
    }
  }

  function UsersApi(Restangular, Headers) {
    Headers.updateDefaultHeader();
    var users = Restangular.service('users');


    var service = {
      self: self,
      scorePrediction: scorePrediction,
      history: history
    };

    return service;


    function self() {
      return users.one('self').get();
    }

    function scorePrediction(userId, activeGroupId) {

      return users.one().one(userId).customGET('score_prediction', {
        group: activeGroupId
      });
    }

    function history(userId, activeGroupId, trackId) {
      return users.one().one(userId).customGET('history', {
        group: activeGroupId,
        trackId: trackId
      });
    }
  }

  function HistoryApi(Restangular, Headers) {
    Headers.updateDefaultHeader();

    var service = {
      getQuestions: getQuestions,
    };

    return service;

    /*Practice*/
    function getQuestions(groupId, page) {
      return Restangular.service(groupId).one('round_sessions').customGET('', {
        'page': page
      });
    }
  }

  function PracticeApi(Restangular, Headers) {
    Headers.updateDefaultHeader();

    var service = {
      getQuestionNewSetByPractice: getQuestionNewSetByPractice,
      createNewPracticeGame: createNewPracticeGame,
      createNewGameSubtrack: createNewGameSubtrack,
      createQuestionPresentation: createQuestionPresentation,
      updateAnswer: updateAnswer,
      getQuestionSetById: getQuestionSetById,
      getQuestionById: getQuestionById

    };

    return service;

    /*Practice*/
    function getQuestionNewSetByPractice(practiceGameId, tracks) {
      return Restangular.service('practice_games').one(practiceGameId, 'sample').customGET('', {
        'tracks[]': tracks
      });
    }

    function createNewPracticeGame(groupId, trackId) {
      return Restangular.service(groupId).one('tracks').one(trackId).post('practice');
    }

    function createNewGameSubtrack(groupId, subTrackId) {
      return Restangular.service(groupId).one('subtracks').one(subTrackId).post('practice');
    }

    /*Round Sessions*/
    function createQuestionPresentation(gameId, questionId) {
      return Restangular.service('round_sessions').one().post('', {
        game_id: gameId,
        question_id: questionId
      });
    }

    function updateAnswer(roundSessionAnswerId, answerId) {
      Restangular.service('round_sessions').one().one(roundSessionAnswerId).put({
        answer_id: answerId
      });
    }

    /*question sets*/
    function getQuestionSetById(questionSetId) {
      return Restangular.service('question_sets').one().one(questionSetId).customGET('');
    }

    /*questions*/
    function getQuestionById(questionId) {
      return Restangular.service('questions').one().one(questionId).customGET('');
    }
  }

  function GroupsApi(Restangular, Headers) {
    Headers.updateDefaultHeader();
    var currentGroups = null;

    var service = {
      membershipGroups: membershipGroups
    };

    return service;
    function membershipGroups(shouldUpdate) {

      currentGroups = currentGroups == null || shouldUpdate ? Restangular.service('groups').one().customGET('', {
        subdomain: 'www'
      }) : currentGroups;
      return currentGroups;
    }
  }

  function TracksApi(Restangular, Headers) {
    Headers.updateDefaultHeader();
    var trackData = null;

    var service = {
      allByGroup: allByGroup
    }
    return service;

    function allByGroup(groupId, shouldUpdate) {
      trackData = trackData == null || shouldUpdate ? Restangular.service(groupId).one('tracks').customGET() : trackData;
      return trackData;
    }
  }

  function ChallengeApi(Restangular, Headers) {
    Headers.updateDefaultHeader();
    var service = {
      getChallenge: getChallenge
    }
    return service;


    function getChallenge(groupId) {
      return Restangular.service(groupId).one('challenge_games').customGET();
    }
  }

  /*Custom request*/
  function YoutubeVideoApi($q,environmentCons) {

    var service = {
      setYouTubeTitle: setYouTubeTitle
    };

    return service;

    function setYouTubeTitle(youtubeId) {
      var deferred = $q.defer();
      var url = environmentCons.youtubeAPI + youtubeId + "?v=2&alt=json";
      $.ajax({
        url: url,
        dataType: 'jsonp',
        cache: true,
        success: function(data) {
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

})();
