(function() {
  'use strict';
  angular
  .module("grockitApp.practice.services",[])
  .constant('practiceConstants', {
    'optionList': 'abcdefghijklmnopqrstuvwxyz',
    'questionTypesUrl': 'app/components/question-types/directives/'
  })
  .factory('practiceResource', practiceResource);
  practiceResource.$inject = ['$q', '$resource', 'PracticeApi', 'environmentCons', 'alerts', 'DashboardApi'];

  function practiceResource($q, $resource, PracticeApi, environmentCons, alerts, DashboardApi) {
    var questionsData = null,
    position = 0,
    gameId = null,
    service = {
      setQuestionsData: setQuestionsData,
      getQuestionData: getQuestionData,
      getRoundSession: getRoundSession,
      getQuestionFromApi: getQuestionFromApi,
      createNewGame: createNewGame,
      getTimingInformation: getTimingInformation,
      setQuestionData: setQuestionData,
      sendUserReponse: sendUserReponse,
      getRandomTrack: getRandomTrack
    };
    return service;

    function setQuestionsData(groupId, subjectId, type) {
      var deferred = $q.defer();
      PracticeApi.getQuestions(groupId, subjectId, type)
      .then(getQuestionsComplete)
      .catch(getQuestionsFailed);

      function getQuestionsComplete(result) {
        questionsData = null;
        var questData = result.data.questions;
        if (questData.length > 0) {
          service.setQuestionData(questData);
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      }

      function getQuestionsFailed(e) {
        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
      }

      return deferred.promise;
    };

    function setQuestionData(questionResponse) {
      position = 0;
      questionsData = null;
      questionsData = questionResponse;
    };

    function getQuestionData() {
      var questionCount = questionsData.length;

      if (position < questionCount) {

        var questionResult = questionsData[position];

        questionResult['questPosition'] = '';
        position++;
        return questionResult;
      } else {
        position = 0;
        return null;
      }
    };

    function getRoundSession(questionToRequest, groupId) {

      return PracticeApi.createQuestionPresentation(gameId, questionToRequest, groupId)
      .then(getRoundSessionsComplete)
      .catch(getRoundSessionsFailed);

      function getRoundSessionsComplete(response) {

        return response.data.round_session;
      }

      function getRoundSessionsFailed(e) {
        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
      }
    };

    function getQuestionFromApi(questionId) {
      return PracticeApi.getQuestionById(questionId)
      .then(getQuestionComplete)
      .catch(getQuestionFailed);

      function getQuestionComplete(result) {
        var questionCollection = [];
        questionCollection.push(result.data.question);
        return questionCollection;
      }

      function getQuestionFailed(e) {
        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
      }
    };

    function createNewGame(url) {

      return PracticeApi.createNewPracticeGame(url)
      .then(getNewGamecomplete)
      .catch(getNewGameFailed);

      function getNewGamecomplete(game) {
        gameId = null;
        gameId = game.data.practice_game.id
        return gameId;
      }

      function getNewGameFailed(e) {
        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
      }
    };

    function getTimingInformation(trackId, groupId, questionId) {
      var url = environmentCons.timingData + groupId + '/' + trackId + '/' + questionId + '.json';
      return $resource(url).query({
        array: true
      });
    };

    function sendUserReponse(roundSessionAnswerId, answers, groupId, answerStatus) {
      var update = PracticeApi.updateAnswer(roundSessionAnswerId, answers, gameId, groupId)
      update.answers = answers;
      update.correct = answerStatus;
      update.put({
        game_id: gameId
      });
    };

    function getRandomTrack(groupId) {
      return DashboardApi.getDashboard(groupId)
    };
  }
})();
