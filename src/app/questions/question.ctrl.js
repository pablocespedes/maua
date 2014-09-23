(function() {
  angular
  .module('grockitApp.question')
  .controller('QuestionController', QuestionController);

  /*Manually injection will avoid any minification or injection problem*/
  QuestionController.$inject = ['practiceSrv', 'utilities', 'breadcrumbs', 'alerts', 'PracticeApi', 'Timer', 'SplashMessages'];

  function QuestionController(practiceSrv, utilities, breadcrumbs, alerts, PracticeApi, Timer, SplashMessages) {
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
    vmPr.answerHasExplanation = answerHasExplanation;
    vmPr.revealExplanation = revealExplanation;
    vmPr.nextAction = nextAction;
    vmPr.init = init;


    function answerHasExplanation(index) {
      var answer = vmPr.questionResult.answers[index];
      return !(answer.explanation == null || angular.isUndefined(answer.explanation) || answer.explanation == '');
    }

    function revealExplanation() {
      timerObject.pauseTimers();
      Question.doNotKnowAnswer();
    };

    function nextAction() {
      timerObject.pauseTimers();
      if (vmPr.nextActionTitle == 'Confirm Choice') {
        Question.evaluateConfirmMethod();
      } else {
        timerObject.destroy();
      }

    }

    function init() {
      var questionId = utilities.getCurrentParam('questionId');
      if (angular.isDefined(questionId)) {
        Question.presentQuestion(questionId);
        timerObject.initPracticeTimer();
        timerObject.initQuestionTimer();
      } else {
        alerts.showAlert('Oh sorry, We have problems to load your question, please let us know on feedback@grockit.com.', 'danger');
      }
    };


    var timerObject = {
      setTimingInformation: function(questionId, correctAnswerId, lastAnswerLoaded) {

        practiceSrv.getTimingInformation(vmPr.activeTracks.tracks, vmPr.activeGroupId, questionId)
        .$promise.then(function(result) {
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
      },
      destroyTimers: function() {
        Timer.destroy(vmPr.practiceTimer);
        Timer.destroy(vmPr.questionTimer);

      }
    };

    var Question = {
      bindExplanationInfo: function(info) {
        vmPr.showExplanation = info.showExplanation;
        vmPr.questionExplanation = info.questionExplanation;
        vmPr.tagsResources = info.tagsResources;
        vmPr.tags = info.tags;
        vmPr.xpTag = info.xpTag;
      },
      bindVideoExplanationInfo: function() {
        practiceSrv.getVideoExplanation(vmPr.questionResult)
        .then(function(videoInfo) {
          vmPr.showVideo = videoInfo.showVideo;
          vmPr.videoId = videoInfo.videoId;
          vmPr.videoText = videoInfo.videoText;
        });
      },
      displayExplanationInfo: function() {
        var generalInfo = practiceSrv.displayGeneralConfirmInfo(vmPr.questionResult);
        Question.bindExplanationInfo(generalInfo);
        Question.bindVideoExplanationInfo(vmPr.questionResult);
      },
      confirmAnswer: function() {
        vmPr.answerStatus = practiceSrv.confirmChoice(vmPr.questionResult, vmPr.roundSessionAnswer, vmPr.items);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          Question.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        }
      },
      resetLayout: function() {
        angular.element('#nextAction').addClass('hide');
        practiceSrv.resetLayout();
      },
      doNotKnowAnswer: function() {
        var generalResult = practiceSrv.doNotKnowAnswer(vmPr.questionResult);
        Question.bindVideoExplanationInfo(vmPr.questionResult);
        if (angular.isDefined(generalResult)) {
          this.resetLayout();
          Question.bindExplanationInfo(generalResult);
          vmPr.isbuttonClicked = true;
        }
      },
      evaluateConfirmMethod: function() {
        switch (vmPr.lastAnswerLoaded) {
          case 'SPR':
          case 'NumericEntry':
          case 'NumericEntryFraction':
          Question.numericConfirmAnswer();
          break;
          default:
          Question.confirmAnswer();
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
          Question.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        }

      },
      feedbackInfo: function(questionId) {
        vmPr.subjectMail = practiceSrv.setMailToInformation(questionId, vmPr.activeTracks.trackTitle);
      },
      nextQuestion: function() {
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
        angular.element('#PanelQuestion').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          angular.element(this).removeClass();
        });
      },
      presentQuestion: function(questionId) {
        practiceSrv.loadQuestion(questionId).then(function(result) {
          var questionSet = result.questionResult.question_set;
          PracticeApi.createNewGameSubtrack(vmPr.activeGroupId, questionSet.subtrack_id)
          .then(function(resultGame) {
            return practiceSrv.getRoundSession(questionId, resultGame.data.practice_game.id);
          })
          .then(function(roundResult) {
            vmPr.roundSessionAnswer = roundResult.roundSessionAnswer;
          });

          vmPr.questionResult = result.questionResult;
          vmPr.lastAnswerLoaded = result.lastAnswerLoaded;
           vmPr.answerType = practiceSrv.getAnswerType(result.lastAnswerLoaded);
          vmPr.questionInformation = result.questionInformation;
          vmPr.stimulus = result.stimulus;
          vmPr.items = [];
          vmPr.items = result.items;
          vmPr.loading = false;
          vmPr.position++;
          vmPr.fixedWidth = result.fixedWidth;

          /*find correct answer to be send to timing section*/
          var correctAnswerId = _.find(result.questionResult.answers, {
            'correct': true
          }).id;
          timerObject.resetQuestionTimer();
          Question.feedbackInfo(questionId);
          if (vmPr.questionAnalytics) {
            timerObject.setTimingInformation(questionId, correctAnswerId, vmPr.lastAnswerLoaded);
          }
        });
      }
    };
}

})();
