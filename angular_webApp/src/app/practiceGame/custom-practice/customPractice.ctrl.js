practiceGame.controller('CustomPracticeController', ['$scope', 'practiceSrv', 'Utilities', 'breadcrumbs', 'practiceRequests', 'Alerts', 'Timer',
  function ($scope, practiceSrv, Utilities, breadcrumbs, practiceRequests, Alerts, Timer) {

    $scope.activeTracks = Utilities.getActiveTrack();

    $scope.activeGroupId = Utilities.getActiveGroup();
    $scope.breadcrumbs = breadcrumbs;
    breadcrumbs.options = { 'practice': $scope.activeTracks.trackTitle };

    $scope.portalC = $scope;
    $scope.loading = true;
    $scope.nextActionTitle = 'Confirm Choice';
    $scope.questionItems = [];
    $scope.practiceTimer = '00:00';
    $scope.questionTimer = '00:00';
    $scope.answerStatus = null;
    $scope.showExplanation = false;
    $scope.showVideo = false;
    $scope.setPosition = 0;
    $scope.position = 0;
    $scope.lastAnswerLoaded = '';

    var timer = {
      setTimingInformation: function (questionId,correctAnswerId) {

        practiceSrv.getTimingInformation($scope.activeTracks.tracks, $scope.activeGroupId, questionId).success(function (result) {
          if(angular.isDefined(result)){
            $scope.showTiming=true;
            $scope.timingData = result[0];
            Utilities.mergeCollection($scope.items, result[0].answers);
            $scope.percentAnswered= Utilities.findInCollection(result[0].answers, { 'answer_id':correctAnswerId }).percent_answered;
          }

        }).error(function (error) {
          $scope.showTiming=false;
        });
      },
      initPracticeTimer: function () {
        $scope.practiceTimer = Timer.create();
      },
      initQuestionTimer: function () {
        $scope.questionTimer = Timer.create();
      },
      resetQuestionTimer: function () {
        $scope.questionTimer.reset();
        $scope.questionTimer.start();
        timer.restartPracticeTimer();
      },
      restartPracticeTimer: function () {
        $scope.practiceTimer.start();
      },
      pauseTimers: function () {
        $scope.practiceTimer.pause();
        $scope.questionTimer.pause();
      }
    };


    var customPractice = {
      bindExplanationInfo: function (info) {
        $scope.showExplanation = info.showExplanation;
        $scope.questionExplanation = info.questionExplanation;
        $scope.showVideo = info.showVideo;
        $scope.tagsResources = info.tagsResources;
        $scope.videoId = info.videoId;
        $scope.videoText = info.videoText;
        $scope.tags = info.tags;
        $scope.xpTag = info.xpTag;
      },
      presentQuestion: function (questionId, gameId) {
        practiceSrv.loadQuestion(questionId, gameId).then(function (result) {
          $scope.questionResult = result.questionResult;
          $scope.roundSessionAnswer = result.roundSessionAnswer;
          $scope.lastAnswerLoaded = result.lastAnswerLoaded;
          $scope.questionInformation = result.questionInformation;
          $scope.stimulus = result.stimulus;
          $scope.items = [];
          $scope.items = result.items;
          $scope.loading = false;
          $scope.position++;

          /*find correct answer to be send to timing section*/
          var correctAnswerId =Utilities.findInCollection(result.questionResult.answers, { 'correct':true }).id;
          timer.resetQuestionTimer();
          customPractice.feedbackInfo(questionId);
          timer.setTimingInformation(questionId,correctAnswerId);
        });
      },
      displayExplanationInfo: function () {
        if (angular.isDefined($scope.answerStatus)) {
          $scope.nextActionTitle = 'Next Question';
          practiceSrv.displayGeneralConfirmInfo($scope.questionResult).then(function (generalInfo) {
            customPractice.bindExplanationInfo(generalInfo);

          });
        }
      },
      confirmAnswer: function () {
        $scope.answerStatus = practiceSrv.confirmChoice($scope.questionResult, $scope.roundSessionAnswer);
        customPractice.displayExplanationInfo();
      },
      resetLayout: function () {
        $scope.nextActionTitle = 'Next Question';
        practiceSrv.resetLayout();
      },
      getQuestionSets: function () {
        var getQuestionSet = practiceRequests.practiceGames().getQuestionNewSetByPractice($scope.gameId, $scope.activeTracks.tracks);

        getQuestionSet.then(function (result) {

          if (result.data.question_sets.length > 0) {

            $scope.questionSetList = result.data.question_sets;
            customPractice.loadQuestionsSet();
          }
          else {
            /*if user run out of the questions show message*/
            practiceSrv.usersRunOutQuestions();

          }


        }).catch(function error(error) {

          Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');

        });

      },
      loadQuestionsSet: function () {

        if (angular.isDefined($scope.questionSetList) && $scope.questionSetList.length > 0) {

          /*if $scope.setPosition is bigger than $scope.questionSetList.length we already finish the list of question sets */
          if ($scope.setPosition < $scope.questionSetList.length) {

            var setPosition = $scope.setPosition,

            /* Iterate between all the question sets retrieved it by the API */
              questionSetResult = $scope.questionSetList[setPosition];

            var position = $scope.position,
            /* questionsCount Give us the number of questions by questionSet*/
              questionsCount = questionSetResult.questions.length;
            $scope.questCount = questionsCount;
            $scope.questByQSetTitle = questionsCount > 1 ? 'Question ' + (position + 1) + ' of ' + (questionsCount) + ' for this set' : '';


            /* Iterate between all the question retrieved it by the API which belong to a specific Question set */
            var questionIdToRequest = questionSetResult.questions[position];
            if (position < questionsCount) {

              customPractice.presentQuestion(questionIdToRequest, $scope.gameId)
            }
            else {
              $scope.position = 0;
              $scope.setPosition++;
              customPractice.loadQuestionsSet();
            }
          }
          else {
            /*If we finish with the first load of questions id/question sets que create a new game*/
            $scope.setPosition = 0;
            customPractice.getQuestionSets();
          }

        }


      },
      doNotKnowAnswer: function () {
        this.resetLayout();
        practiceSrv.doNotKnowAnswer($scope.questionResult).then(function (generalInfo) {
          customPractice.bindExplanationInfo(generalInfo);
        });

      },
      evaluateConfirmMethod: function () {
        switch ($scope.lastAnswerLoaded) {
          case 'NumericEntry':
          case 'NumericEntryFraction':
            customPractice.numericConfirmAnswer();
            break;
          default:
            customPractice.confirmAnswer();
        }
      },
      numericConfirmAnswer: function () {
        var options = {};
        options.numerator = $scope.numerator;
        options.denominator = $scope.denominator;
        options.lastAnswerLoaded = $scope.lastAnswerLoaded;
        options.questionResult = $scope.questionResult;
        options.roundSessionAnswer = $scope.roundSessionAnswer;

        $scope.answerStatus = practiceSrv.numericEntryConfirmChoice(options);
        customPractice.displayExplanationInfo();

      },
      nextQuestion: function () {
        this.loadQuestionsSet();

        //Enable/disable answer section
        $scope.numerator = null;
        $scope.denominator = null;
        angular.element('#answercontent *').removeClass('btn-primary btn-danger btn-success').removeAttr('disabled');
        $scope.showVideo = false;
        $scope.showExplanation = false;
        $scope.answerStatus = null;
        $scope.nextActionTitle = 'Confirm Choice';
        $scope.messageConfirmation = '';
        angular.element('#skipAction').removeClass('hide');
        angular.element('#nextAction').removeClass('btn-primary');
        angular.element('#answersPanels').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          angular.element(this).removeClass();
        });

      },
      feedbackInfo: function (questionId) {
        $scope.subjectMail = practiceSrv.setMailToInformation(questionId, $scope.activeTracks.trackTitle);
      }
    };

    $scope.CreateNewGame = function () {

      var createGame = practiceRequests.practiceGames().createNewPracticeGame($scope.activeGroupId);

      createGame.then(function (game) {
        $scope.gameId = game.data.practice_game.id;

        customPractice.getQuestionSets();
        timer.initPracticeTimer();
        timer.initQuestionTimer();

      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');

      });


    };

    $scope.answerHasExplanation = function (index) {
      var answer = $scope.questionResult.answers[index];
      return !(answer.explanation == null || angular.isUndefined(answer.explanation) || answer.explanation == '');

    };

    $scope.nextAction = function () {
      timer.pauseTimers();
      if ($scope.nextActionTitle == 'Confirm Choice') {
        customPractice.evaluateConfirmMethod();
      }
      else {
        customPractice.nextQuestion();
      }
    };

    $scope.revealExplanation = function () {
      timer.pauseTimers();
      customPractice.doNotKnowAnswer();
    };

    $scope.CreateNewGame();

  }]);