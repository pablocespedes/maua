'use strict';
practiceGame.controller('CustomPracticeController', ['$scope', 'practiceSrv', 'Utilities', 'breadcrumbs', 'practiceRequests', 'Alerts', 'Timer', 'SplashMessages', '$timeout',
  function($scope, practiceSrv, Utilities, breadcrumbs, practiceRequests, Alerts, Timer, SplashMessages, $timeout) {

    $scope.activeTracks = Utilities.getActiveTrack();
    $scope.activeGroupId = Utilities.getActiveGroup();
    $scope.questionAnalytics = ($scope.activeGroupId === 'gmat' || $scope.activeGroupId === 'act'
      || $scope.activeGroupId === 'sat' || $scope.activeGroupId === 'gre');
    $scope.breadcrumbs = breadcrumbs;
    breadcrumbs.options = {
      'practice': $scope.activeTracks.trackTitle
    };
    $scope.maxOpts=[];
    $scope.tagsResources = [];
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
    $scope.loadingMessage = SplashMessages.getLoadingMessage();
    $scope.isDisabled = false;
    var timer = {
      setTimingInformation: function(questionId, correctAnswerId) {

        practiceSrv.getTimingInformation($scope.activeTracks.tracks, $scope.activeGroupId, questionId).$promise.then(function(result) {
          if (angular.isDefined(result)) {
            $scope.showTiming = true;
            $scope.timingData = result[0];

            Utilities.mergeCollection($scope.items, result[0].answers);


            $scope.percentAnswered = Utilities.findInCollection(result[0].answers, {
              'answer_id': correctAnswerId
            }).percent_answered;
          }

        }).catch(function(e) {
          $scope.showTiming = false;
        });
      },
      initPracticeTimer: function() {
        $scope.practiceTimer = Timer.create();
      },
      initQuestionTimer: function() {
        $scope.questionTimer = Timer.create();
      },
      resetQuestionTimer: function() {
        $scope.questionTimer.reset();
        $scope.questionTimer.start();
        timer.restartPracticeTimer();
      },
      restartPracticeTimer: function() {
        $scope.practiceTimer.start();
      },
      pauseTimers: function() {
        $scope.practiceTimer.pause();
        $scope.questionTimer.pause();
      }
    };

    var customPractice = {
      createQuestionSharedList: function(questions) {
        if (angular.isUndefined($scope.questions)) {
          $scope.questions = Utilities.mapObject(questions, 'id', function(question) {
            return question;
          });
        }
      },
      setAnswerStatusToSharedList: function(answerStatus) {
        var question = Utilities.findInCollection($scope.questions, {
          'id': $scope.currentId
        });
        question.answerStatus = answerStatus;
        question.statusClass = '';
        if (angular.isDefined(question.answerStatus)) {
          question.statusClass = question.answerStatus ? 'bg-success' : 'bg-danger';
        }
      },
      bindExplanationInfo: function(info) {
        $scope.showExplanation = info.showExplanation;
        $scope.questionExplanation = info.questionExplanation;
        $scope.tagsResources = info.tagsResources;
        $scope.tags = info.tags;
        $scope.xpTag = info.xpTag;
        $scope.nextActionTitle = 'Next Question';
        $timeout(function() {
          $scope.isDisabled = false;
        }, 200);
      },
      bindVideoExplanationInfo: function() {
        practiceSrv.getVideoExplanation($scope.questionResult).then(function(videoInfo) {
          $scope.showVideo = videoInfo.showVideo;
          $scope.videoId = videoInfo.videoId;
          $scope.videoText = videoInfo.videoText;
        });
      },
      presentQuestion: function(questionId, gameId) {

        practiceSrv.getRoundSession(questionId, gameId).then(function(result) {
          $scope.roundSessionAnswer = result.roundSessionAnswer;
        });

        practiceSrv.loadQuestion(questionId).then(function(result) {
          $scope.questionResult = result.questionResult;
          $scope.lastAnswerLoaded = result.lastAnswerLoaded;
          $scope.questionInformation = result.questionInformation;
          $scope.stimulus = result.stimulus;
          $scope.items = [];
          $scope.maxOpts=[];
          $scope.items = result.items;
          $scope.loading = false;
          $scope.position++;

          /*find correct answer to be send to timing section*/
          var correctAnswerId = Utilities.findInCollection(result.questionResult.answers, {
            'correct': true
          }).id;
          timer.resetQuestionTimer();
          customPractice.feedbackInfo(questionId);
          if ($scope.questionAnalytics){
            timer.setTimingInformation(questionId, correctAnswerId);
          }

        });
      },
      displayExplanationInfo: function() {
        var generalInfo = practiceSrv.displayGeneralConfirmInfo($scope.questionResult);
        customPractice.bindExplanationInfo(generalInfo);
        customPractice.bindVideoExplanationInfo($scope.questionResult);
      },
      confirmAnswer: function() {
        $scope.answerStatus = practiceSrv.confirmChoice($scope.questionResult, $scope.roundSessionAnswer, $scope.items);
        if (angular.isDefined($scope.answerStatus)) {
          this.resetLayout();
          /* customPractice.setAnswerStatusToSharedList($scope.answerStatus);*/
          customPractice.displayExplanationInfo();
        }
        else
         $scope.isDisabled = false;
     },
     resetLayout: function() {
       $scope.nextActionTitle = 'Next Question';
       practiceSrv.resetLayout();
     },
     getQuestionSets: function() {
       var getQuestionSet = practiceRequests.practiceGames().getQuestionNewSetByPractice($scope.gameId, $scope.activeTracks.tracks);
       getQuestionSet.then(function(result) {
        if (result.data.question_sets.length > 0) {
          $scope.questionSetList = result.data.question_sets;

          customPractice.loadQuestionsSet();
        } else {
          /*if user run out of the questions show message*/
          practiceSrv.usersRunOutQuestions($scope.activeTracks.trackTitle, $scope.activeGroupId);

        }
      }).catch(function errorHandler(e) { Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger'); });
     },
     loadQuestionsSet: function() {
      if (angular.isDefined($scope.questionSetList) && $scope.questionSetList.length > 0) {

        /*if $scope.setPosition is bigger than $scope.questionSetList.length we already finish the list of question sets */
        if ($scope.setPosition < $scope.questionSetList.length) {

          var setPosition = $scope.setPosition,

          /* Iterate between all the question sets retrieved it by the API */
          questionSetResult = $scope.questionSetList[setPosition];

          var position = $scope.position;
          /* questionsCount Give us the number of questions by questionSet*/
          $scope.questionsCount = questionSetResult.questions.length;

          /*customPractice.createQuestionSharedList(questionSetResult.questions);*/
          $scope.questByQSetTitle = $scope.questionsCount > 1 ? 'Question ' + (position + 1) + ' of ' + ($scope.questionsCount) + ' for this set' : '';

          if (position < $scope.questionsCount) {
            var questionIdToRequest = questionSetResult.questions[position];
            $scope.currentId = questionIdToRequest;

            customPractice.presentQuestion(questionIdToRequest, $scope.gameId);
          } else {
            $scope.position = 0;
            $scope.setPosition++;
            customPractice.loadQuestionsSet();
            /* New set, delete the questions, this way they are reinitialized*/
          }
        } else {
          /*If we finish with the first load of questions id/question sets que create a new game*/
          $scope.setPosition = 0;
          customPractice.getQuestionSets();
        }
      }
    },
    doNotKnowAnswer: function() {
      $scope.userConfirmed = false;
      var generalResult = practiceSrv.doNotKnowAnswer($scope.questionResult);
      customPractice.bindVideoExplanationInfo($scope.questionResult);
      if (angular.isDefined(generalResult)) {
       this.resetLayout();
       customPractice.bindExplanationInfo(generalResult);
     }
     else
       $scope.isDisabled = false;
   },
   evaluateConfirmMethod: function() {
    $scope.userConfirmed = true;
    switch ($scope.lastAnswerLoaded) {
      case 'SPR':
      case 'NumericEntry':
      case 'NumericEntryFraction':
      customPractice.numericConfirmAnswer();
      break;
      default:
      customPractice.confirmAnswer();
    }
  },
  numericConfirmAnswer: function() {
    var options = {};
    options.numerator = $scope.numerator;
    options.denominator = $scope.denominator;
    options.lastAnswerLoaded = $scope.lastAnswerLoaded;
    options.questionResult = $scope.questionResult;
    options.roundSessionAnswer = $scope.roundSessionAnswer;

    $scope.answerStatus = practiceSrv.numericEntryConfirmChoice(options);
    if (angular.isDefined($scope.answerStatus)) {
      this.resetLayout();
      /* customPractice.setAnswerStatusToSharedList($scope.answerStatus);*/
      customPractice.displayExplanationInfo();
    }
  },
  nextQuestion: function() {
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
        angular.element('#PanelQuestion').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          angular.element(this).removeClass();
        });
      },
      feedbackInfo: function(questionId) {
        $scope.subjectMail = practiceSrv.setMailToInformation(questionId, $scope.activeTracks.trackTitle);
      }
    };

    $scope.CreateNewGame = function() {
      var createGame = practiceRequests.practiceGames().createNewPracticeGame($scope.activeGroupId, $scope.activeTracks.tracks[0]);

      createGame.then(function(game) {
        $scope.gameId = game.data.practice_game.id;

        customPractice.getQuestionSets();
        timer.initPracticeTimer();
        timer.initQuestionTimer();

      }).catch(function errorHandler(e) {

        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');

      });
    };

    $scope.answerHasExplanation = function(index) {
      var answer = $scope.questionResult.answers[index];
      return !(answer.explanation === null || angular.isUndefined(answer.explanation) || answer.explanation ==='');

    };

    $scope.nextAction = function() {
      timer.pauseTimers();
      if ($scope.nextActionTitle == 'Confirm Choice') {
        $scope.isDisabled = true;
        customPractice.evaluateConfirmMethod();
      } else {

        customPractice.nextQuestion();
      }
    };

    $scope.revealExplanation = function() {
      timer.pauseTimers();
      customPractice.doNotKnowAnswer();
    };

    $scope.CreateNewGame();

  }
  ]);






