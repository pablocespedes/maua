(function() {
  'use strict';
  angular
  .module('grockitApp.requests')
  .factory('Headers', Headers)
  .factory('UsersApi', UsersApi)
  .factory('PracticeApi', PracticeApi)
  .factory('HistoryApi', HistoryApi)
  .factory('GroupsApi', GroupsApi)
  .factory('YoutubeVideoApi', YoutubeVideoApi)
  .factory('DashboardApi', DashboardApi)
  .factory('ReviewAPI',ReviewAPI);

  Headers.$inject = ['Restangular'];
  UsersApi.$inject = ['Restangular', 'Headers'];
  PracticeApi.$inject = ['Restangular', 'Headers'];
  HistoryApi.$inject = ['Restangular', 'Headers'];
  GroupsApi.$inject = ['Restangular', 'Headers'];
  YoutubeVideoApi.$inject = ['$q', 'environmentCons'];
  DashboardApi.$inject = ['Restangular', 'Headers'];
  ReviewAPI.$inject = ['Restangular', 'Headers'];

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

    function getQuestions(groupId, page) {
      return Restangular.one(groupId,'round_sessions').customGET('', {
        'page': page
      });
    }
  }

  function PracticeApi(Restangular, Headers) {
    Headers.updateDefaultHeader();

    var service = {
      createNewPracticeGame: createNewPracticeGame,
      createNewGameSubtrack: createNewGameSubtrack,
      createQuestionPresentation: createQuestionPresentation,
      getQuestions:getQuestions,
      updateAnswer: updateAnswer,
      getQuestionById: getQuestionById

    };

    return service;

    function createNewPracticeGame(url) {
      if ( url.split(/^\//).length > 0 ) {
        url = url.split(/^\//)[1];
      }

      return  Restangular.one(url).post();
    }

    function createNewGameSubtrack(groupId, subTrackId) {
      return Restangular.one(groupId,'subtracks').one(subTrackId).post('practice');
    }

    /*Round Sessions*/
    function createQuestionPresentation(gameId, questionId,groupId) {
      return Restangular.one(groupId,'round_sessions').post('','', {
        game_id: gameId,
        question_id: questionId
      });
    }

    function updateAnswer(roundSessionAnswerId, answers,gameId,groupId) {

      return Restangular.one(groupId,'round_sessions').one(roundSessionAnswerId);

     //return Restangular.one(groupId,'round_sessions').one(roundSessionAnswerId).put();
    }


    /*questions*/
    function getQuestionById(questionId) {
      return Restangular.service('questions').one().one(questionId).customGET('');
    }
    /*subject mean a possible trackId or subtrackId*/
    function getQuestions(groupId,subjectId,type){
      var subjectType = type==='Track' ? 'tracks' : 'subtracks';

      return Restangular.service(groupId).one().one(subjectType,subjectId).customGET('questions');
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
      currentGroups = currentGroups == null || shouldUpdate ? Restangular.one('groups').customGET('', {
        subdomain: 'www'
      }) : currentGroups;
      return currentGroups;
    }
  }

  function DashboardApi(Restangular, Headers){
    Headers.updateDefaultHeader();

    var service = {
      getDashboard: getDashboard
    }
    return service;


    function getDashboard(groupId) {
      return Restangular.one(groupId,'dashboard').get();
    }
  }

  function ReviewAPI(Restangular,Headers){
    Headers.updateDefaultHeader();

    var service = {
      getRoundSession: getRoundSession,
    };

    return service;

    function getRoundSession(groupId, rounSessionId) {
      return Restangular.one(groupId,'round_sessions').customGET(rounSessionId);
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
