(function() {
  'use strict';
  angular
  .module('grockitApp.practice')
  .controller('CustomPracticeController', CustomPracticeController);

  /*Manually injection will avoid any minification or injection problem*/
  CustomPracticeController.$inject = ['$timeout', 'practiceSrv', 'utilities', 'breadcrumbs', 'PracticeApi', 'alerts', 'Timer', 'SplashMessages'];

  function CustomPracticeController($timeout, practiceSrv, utilities, breadcrumbs, PracticeApi, alerts, Timer, SplashMessages) {

    /* jshint validthis: true */
    var vmPr = this;
    vmPr.activeTracks = utilities.getActiveTrack();
    vmPr.activeGroupId = utilities.getActiveGroup();
    vmPr.questionAnalytics = (vmPr.activeGroupId === 'gmat' || vmPr.activeGroupId === 'act' || vmPr.activeGroupId === 'sat' || vmPr.activeGroupId === 'gre');
    vmPr.breadcrumbs = breadcrumbs;
    breadcrumbs.options = {
      'practice': vmPr.activeTracks.trackTitle
    };
    vmPr.isbuttonClicked = false;
    vmPr.maxOpts = [];
    vmPr.tagsResources = [];
    vmPr.portalC = vmPr;
    vmPr.loading = true;
    vmPr.nextActionTitle = 'Confirm Choice';
    vmPr.questionItems = [];
    vmPr.answerStatus = null;
    vmPr.showExplanation = false;
    vmPr.showVideo = false;
    vmPr.setPosition = 0;
    vmPr.position = 0;
    vmPr.lastAnswerLoaded = '';
    vmPr.loadingMessage = SplashMessages.getLoadingMessage();
    vmPr.isDisabled = false;
    vmPr.init = init;
    vmPr.answerHasExplanation = answerHasExplanation;
    vmPr.nextAction = nextAction;
    vmPr.revealExplanation=revealExplanation;

    function init() {
      var createGame = PracticeApi.createNewPracticeGame(vmPr.activeGroupId, vmPr.activeTracks.tracks[0]);

      createGame.then(function(game) {
        vmPr.gameId = game.data.practice_game.id;

        customPractice.getQuestionSets();
        timerObject.initPracticeTimer();
        timerObject.initQuestionTimer();

      }).catch(function errorHandler(e) {

        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');

      });
    };

    function answerHasExplanation(index) {
      var answer = vmPr.questionResult.answers[index];
      return !(answer.explanation === null || angular.isUndefined(answer.explanation) || answer.explanation === '');

    };

    function nextAction() {
      timerObject.pauseTimers();
      if (vmPr.nextActionTitle == 'Confirm Choice') {
        vmPr.isDisabled = true;
        customPractice.evaluateConfirmMethod();
      } else {

        customPractice.nextQuestion();
      }
    };

    function revealExplanation() {
      timerObject.pauseTimers();
      customPractice.doNotKnowAnswer();
    };

    var timerObject = {
      setTimingInformation: function(questionId, correctAnswerId, lastAnswerLoaded) {

        practiceSrv.getTimingInformation(vmPr.activeTracks.tracks, vmPr.activeGroupId, questionId)
        .$promise.then(function(result) {
          if (angular.isDefined(result)) {
            vmPr.showTiming = true;
            vmPr.timingData = result[0];

            if (lastAnswerLoaded === 'MultipleChoiceOneCorrect') {
              var mergedList = _.map(vmPr.items, function(item) {
                return _.extend(item, _.findWhere(result[0].answers, {
                  'answer_id': item.id
                }));
              });

              vmPr.percentAnswered = _.find(result[0].answers, {
                'answer_id': correctAnswerId
              }).percent_answered;
            }
          }

        }).catch(function(e) {
          vmPr.showTiming = false;
        });
      },
      initPracticeTimer: function() {
        vmPr.practiceTimer = Timer.create();
      },
      initQuestionTimer: function() {
        vmPr.questionTimer = Timer.create();
      },
      resetQuestionTimer: function() {
        vmPr.questionTimer.reset();
        vmPr.questionTimer.start();
        timerObject.restartPracticeTimer();
      },
      restartPracticeTimer: function() {
        vmPr.practiceTimer.start();
      },
      pauseTimers: function() {
        vmPr.practiceTimer.pause();
        vmPr.questionTimer.pause();
      }
    };

    var customPractice = {
      createQuestionSharedList: function(questions) {
        if (angular.isUndefined(vmPr.questions)) {
          vmPr.questions = utilities.mapObject(questions, 'id', function(question) {
            return question;
          });
        }
      },
      setAnswerStatusToSharedList: function(answerStatus) {
        var question = _.find(vmPr.questions, {
          'id': vmPr.currentId
        });

        question.answerStatus = answerStatus;
        question.statusClass = '';
        if (angular.isDefined(question.answerStatus)) {
          question.statusClass = question.answerStatus ? 'bg-success' : 'bg-danger';
        }
      },
      bindExplanationInfo: function(info) {
        vmPr.showExplanation = info.showExplanation;
        vmPr.questionExplanation = info.questionExplanation;
        vmPr.tagsResources = info.tagsResources;
        vmPr.tags = info.tags;
        vmPr.xpTag = info.xpTag;
        vmPr.nextActionTitle = 'Next Question';
        $timeout(function() {
          vmPr.isDisabled = false;
        }, 200);
      },
      bindVideoExplanationInfo: function() {
        practiceSrv.getVideoExplanation(vmPr.questionResult).then(function(videoInfo) {
          vmPr.showVideo = videoInfo.showVideo;
          vmPr.videoId = videoInfo.videoId;
          vmPr.videoText = videoInfo.videoText;
        });
      },
      presentQuestion: function(questionId, gameId) {

        practiceSrv.getRoundSession(questionId, gameId).then(function(result) {
          vmPr.roundSessionAnswer = result.roundSessionAnswer;
        });

        practiceSrv.loadQuestion(questionId)
        .then(function(result) {
          vmPr.questionResult = result.questionResult;
          vmPr.lastAnswerLoaded = result.lastAnswerLoaded;
          vmPr.answerType = practiceSrv.getAnswerType(result.lastAnswerLoaded);
          vmPr.questionInformation = result.questionInformation;
          vmPr.stimulus = result.stimulus;
          vmPr.items = [];
          vmPr.maxOpts = [];
          vmPr.items = result.items;
          vmPr.loading = false;
          vmPr.position++;
          vmPr.fixedWidth = result.fixedWidth;

          /*find correct answer to be send to timing section*/
          var correctAnswerId = _.find(result.questionResult.answers, {
            'correct': true
          }).id;

          timerObject.resetQuestionTimer();
          customPractice.feedbackInfo(questionId);
          if (vmPr.questionAnalytics) {
            timerObject.setTimingInformation(questionId, correctAnswerId, vmPr.lastAnswerLoaded);
          }

        });
      },
      displayExplanationInfo: function() {
        var generalInfo = practiceSrv.displayGeneralConfirmInfo(vmPr.questionResult);
        customPractice.bindExplanationInfo(generalInfo);
        customPractice.bindVideoExplanationInfo(vmPr.questionResult);
      },
      confirmAnswer: function() {
        vmPr.answerStatus = practiceSrv.confirmChoice(vmPr.questionResult, vmPr.roundSessionAnswer, vmPr.items);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          customPractice.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        } else
        vmPr.isDisabled = false;
      },
      resetLayout: function() {
        vmPr.nextActionTitle = 'Next Question';
        practiceSrv.resetLayout();
      },
      getQuestionSets: function() {
        var getQuestionSet = PracticeApi.getQuestionNewSetByPractice(vmPr.gameId, vmPr.activeTracks.tracks);
        getQuestionSet.then(function(result) {
          if (result.data.question_sets.length > 0) {
            vmPr.questionSetList = result.data.question_sets;

            customPractice.loadQuestionsSet();
          } else {
            /*if user run out of the questions show message*/
            practiceSrv.usersRunOutQuestions(vmPr.activeTracks.trackTitle, vmPr.activeGroupId);

          }
        }).catch(function errorHandler(e) {
          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      },
      loadQuestionsSet: function() {
        if (angular.isDefined(vmPr.questionSetList) && vmPr.questionSetList.length > 0) {

          /*if $scope.setPosition is bigger than $scope.questionSetList.length we already finish the list of question sets */
          if (vmPr.setPosition < vmPr.questionSetList.length) {

            var setPosition = vmPr.setPosition,

            /* Iterate between all the question sets retrieved it by the API */
            questionSetResult = vmPr.questionSetList[setPosition];

            var position = vmPr.position;
            /* questionsCount Give us the number of questions by questionSet*/
            vmPr.questionsCount = questionSetResult.questions.length;

            /*customPractice.createQuestionSharedList(questionSetResult.questions);*/
            vmPr.questByQSetTitle = vmPr.questionsCount > 1 ? 'Question ' + (position + 1) + ' of ' + (vmPr.questionsCount) + ' for this set' : '';

            if (position < vmPr.questionsCount) {
              var questionIdToRequest = questionSetResult.questions[position];
              vmPr.currentId = questionIdToRequest;

              customPractice.presentQuestion(questionIdToRequest, vmPr.gameId);
            } else {
              vmPr.position = 0;
              vmPr.setPosition++;
              customPractice.loadQuestionsSet();
              /* New set, delete the questions, this way they are reinitialized*/
            }
          } else {
            /*If we finish with the first load of questions id/question sets que create a new game*/
            vmPr.setPosition = 0;
            customPractice.getQuestionSets();
          }
        }
      },
      doNotKnowAnswer: function() {
        vmPr.userConfirmed = false;
        var generalResult = practiceSrv.doNotKnowAnswer(vmPr.questionResult);
        customPractice.bindVideoExplanationInfo(vmPr.questionResult);
        if (angular.isDefined(generalResult)) {
          this.resetLayout();
          customPractice.bindExplanationInfo(generalResult);
          vmPr.isbuttonClicked = true;
        } else
        vmPr.isDisabled = false;
      },
      evaluateConfirmMethod: function() {
        vmPr.userConfirmed = true;
        switch (vmPr.lastAnswerLoaded) {
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
        options.numerator = vmPr.numerator;
        options.denominator = vmPr.denominator;
        options.lastAnswerLoaded = vmPr.lastAnswerLoaded;
        options.questionResult = vmPr.questionResult;
        options.roundSessionAnswer = vmPr.roundSessionAnswer;

        vmPr.answerStatus = practiceSrv.numericEntryConfirmChoice(options);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          customPractice.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        }
      },
      feedbackInfo: function(questionId) {
        vmPr.subjectMail = practiceSrv.setMailToInformation(questionId, vmPr.activeTracks.trackTitle);
      },
      nextQuestion: function() {
        this.loadQuestionsSet();
        vmPr.isbuttonClicked = false;
        vmPr.numerator = null;
        vmPr.denominator = null;
        angular.element('#answercontent *').removeClass('btn-primary btn-danger btn-success').removeAttr('disabled');
        vmPr.showVideo = false;
        vmPr.showExplanation = false;
        vmPr.answerStatus = null;
        vmPr.nextActionTitle = 'Confirm Choice';
        vmPr.messageConfirmation = '';
        angular.element('#skipAction').removeClass('hide');
        angular.element('#nextAction').removeClass('btn-primary');
        angular.element('#PanelQuestion').addClass('fadeIn animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          angular.element(this).removeClass();
        });
      }
    };
  }

})();
