(function() {
  'use strict';
  angular
  .module('grockitApp.practice')
  .controller('CustomPracticeController', CustomPracticeController);

  /*Manually injection will avoid any minification or injection problem*/
  CustomPracticeController.$inject = ['$scope', '$timeout', 'practiceUtilities', 'utilities', 'breadcrumbs', 'alerts', 'Timer',
  'SplashMessages', 'currentProduct', 'practiceResource'
  ];

  function CustomPracticeController($scope, $timeout, practiceUtilities, utilities, breadcrumbs, alerts, Timer, SplashMessages, currentProduct, practiceResource) {

    /* jshint validthis: true */
    var vmPr = this,
    practiceObserver = null;

    vmPr.activeTrack = utilities.getActiveTrack();
    vmPr.breadcrumbs = breadcrumbs;
    breadcrumbs.options = {
      'practice': vmPr.activeTrack.subject.name
    };
    vmPr.isbuttonClicked = false;
    vmPr.maxOpts = [];
    vmPr.explanationInfo = {};
    vmPr.videoInfo = {};
    vmPr.explanationInfo.showExplanation = false;
    vmPr.videoInfo.showVideo = false;
    vmPr.portalC = vmPr;
    vmPr.loading = true;
    vmPr.nextActionTitle = 'Confirm Choice';
    vmPr.questionItems = [];
    vmPr.answerStatus = null;
    vmPr.setPosition = 0;
    vmPr.position = 0;
    vmPr.loadingMessage = SplashMessages.getLoadingMessage();
    vmPr.isDisabled = false;
    vmPr.answerHasExplanation = answerHasExplanation;
    vmPr.nextAction = nextAction;
    vmPr.revealExplanation = revealExplanation;

    /*Takes care to unregister the group once the user leaves the controller*/
    $scope.$on("$destroy", function() {
      currentProduct.unregisterGroup(practiceObserver);
    });

    init();

    function init() {
      practiceObserver = currentProduct.observeGroupId().register(function(groupId) {
        if (vmPr.activeGroupId !== groupId) {
          vmPr.activeGroupId = groupId;
          vmPr.questionAnalytics = (vmPr.activeGroupId === 'gmat' || vmPr.activeGroupId === 'act' || vmPr.activeGroupId === 'sat' || vmPr.activeGroupId === 'gre');
          customPractice.getNewPracticeGame(vmPr.activeGroupId, vmPr.activeTrack.subject.url);
        }
      });
    };

    function answerHasExplanation(index) {
      var answer = vmPr.questionData.answers[index];
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
      setTimingInformation: function(questionId, kind) {

        practiceResource.getTimingInformation(vmPr.activeTrack.trackId, vmPr.activeGroupId, questionId)
        .$promise.then(function(result) {
          if (angular.isDefined(result)) {
            var timingData = result[0];
            vmPr.showTiming = true;
            vmPr.timingData = timingData;

            if (kind === 'MultipleChoiceOneCorrect') {
              var mergedList = _.map(vmPr.items, function(item) {
                return _.extend(item, _.findWhere(timingData.answers, {
                  'answer_id': item.id
                }));
              });

              var percentAnswered = (timingData.total_answered_correctly / timingData.total_answered) * 100
              vmPr.percentAnswered = percentAnswered > 0 ? Math.round(percentAnswered.toFixed(2)) : 0;
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
      getNewPracticeGame: function(groupId, apiUrl) {
        practiceResource.createNewGame(groupId, apiUrl).then(function() {
          customPractice.getQuestions();
          timerObject.initPracticeTimer();
          timerObject.initQuestionTimer();
        });
      },
      getQuestions: function(){
        practiceResource.setQuestionsData(vmPr.activeGroupId,vmPr.activeTrack.trackId,vmPr.activeTrack.subject.type)
        .then(setQuestionComplete);
          function setQuestionComplete(questionsResponse){
              customPractice.presentQuestion();
          }
      },
      presentQuestion: function() {
        var questionData =practiceUtilities.presentQuestion(practiceResource.getQuestionData());

        if(angular.isDefined(questionData)){

        practiceResource.getRoundSession(questionData.id).then(function(result) {
          vmPr.roundSessionAnswer = result.roundSessionAnswer;
        });
          vmPr.questionData= questionData;
          vmPr.answerType = practiceUtilities.getAnswerType(questionData.kind);

          vmPr.items = [];
          vmPr.maxOpts = [];
          vmPr.items = questionData.items;
          vmPr.loading = false;
          vmPr.position++;

          timerObject.resetQuestionTimer();
          customPractice.feedbackInfo(questionData.id);
          if (vmPr.questionAnalytics) {
             timerObject.setTimingInformation(questionData.id, questionData.kind);
          }
        }
      },
      displayExplanationInfo: function() {
        var generalInfo = practiceUtilities.displayGeneralConfirmInfo(vmPr.questionData);
        customPractice.bindExplanationInfo(generalInfo);
        customPractice.bindVideoExplanationInfo(vmPr.questionData);
      },
      bindExplanationInfo: function(info) {
        vmPr.explanationInfo = info;
        vmPr.nextActionTitle = 'Next Question';
        $timeout(function() {
          vmPr.isDisabled = false;
        }, 200);
      },
      bindVideoExplanationInfo: function() {
        practiceUtilities.getVideoExplanation(vmPr.questionData).then(function(videoInfo) {
          vmPr.videoInfo = videoInfo;
        });
      },
      doNotKnowAnswer: function() {
        vmPr.userConfirmed = false;
        var generalResult = practiceUtilities.doNotKnowAnswer(vmPr.questionData);
        customPractice.bindVideoExplanationInfo(vmPr.questionData);
        if (angular.isDefined(generalResult)) {
          this.resetLayout();
          customPractice.bindExplanationInfo(generalResult);
          vmPr.isbuttonClicked = true;
        } else
        vmPr.isDisabled = false;
      },
      evaluateConfirmMethod: function() {
        vmPr.userConfirmed = true;
        switch (vmPr.questionData.kind) {
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
        options.lastAnswerLoaded = vmPr.questionData.kind;
        options.questionResult = vmPr.questionData;
        options.roundSessionAnswer = vmPr.roundSessionAnswer;

        vmPr.answerStatus = practiceUtilities.numericEntryConfirmChoice(options);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          customPractice.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        }
      },
      feedbackInfo: function(questionId) {
        vmPr.subjectMail = practiceUtilities.setMailToInformation(questionId, vmPr.activeTrack.subject.name);
      },
      nextQuestion: function() {
        this.loadQuestionsSet();
        vmPr.isbuttonClicked = false;
        vmPr.numerator = null;
        vmPr.denominator = null;
        angular.element('#answercontent *').removeClass('btn-primary btn-danger btn-success').removeAttr('disabled');
        vmPr.videoInfo.showVideo = false;
        vmPr.explanationInfo.showExplanation = false;
        vmPr.answerStatus = null;
        vmPr.nextActionTitle = 'Confirm Choice';
        vmPr.messageConfirmation = '';
        angular.element('#skipAction').removeClass('hide');
        angular.element('#nextAction').removeClass('btn-primary');
        angular.element('#PanelQuestion').addClass('fadeIn animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          angular.element(this).removeClass();
        });
      },
      confirmAnswer: function() {
        vmPr.answerStatus = practiceUtilities.confirmChoice(vmPr.questionData, vmPr.roundSessionAnswer, vmPr.items);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          customPractice.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        } else
        vmPr.isDisabled = false;
      },
      resetLayout: function() {
        vmPr.nextActionTitle = 'Next Question';
        practiceUtilities.resetLayout();
      },
      getQuestionSets: function() {
        var tracks = [];
        tracks.push(vmPr.activeTrack.trackId);

        var getQuestionSet = PracticeApi.getQuestionNewSetByPractice(vmPr.gameId, tracks);
        getQuestionSet.then(function(result) {

          if (result.data.question_sets.length > 0) {
            vmPr.questionSetList = result.data.question_sets;

            customPractice.loadQuestionsSet();
          } else {
            /*if user run out of the questions show message*/
            practiceUtilities.usersRunOutQuestions(vmPr.activeTrack.subject.name, vmPr.activeGroupId);

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

    };
  }
})();
