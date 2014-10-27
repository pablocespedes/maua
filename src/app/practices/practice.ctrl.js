(function() {
  'use strict';
  angular
  .module('grockitApp.practice')
  .controller('CustomPracticeController', CustomPracticeController);

  /*Manually injection will avoid any minification or injection problem*/
  CustomPracticeController.$inject = ['$scope','$timeout', 'practiceUtilities', 'breadcrumbs', 'Timer',
  'SplashMessages', 'currentProduct', 'practiceResource'
  ];

  function CustomPracticeController($scope,$timeout, practiceUtilities, breadcrumbs, Timer, SplashMessages,
    currentProduct, practiceResource) {

    /* jshint validthis: true */
    var vmPr = this,
    practiceObserver = null;
    vmPr.isbuttonClicked = false;
    vmPr.maxOpts = [];
    vmPr.explanationInfo = {};
    vmPr.videoInfo = {};
    vmPr.explanationInfo.showExplanation = false;
    vmPr.videoInfo.showVideo = false;
    vmPr.portalC = vmPr;
    vmPr.loading = true;
    vmPr.nextActionTitle = 'Confirm Choice';
    vmPr.answerStatus = null;
    vmPr.loadingMessage = SplashMessages.getLoadingMessage();
    vmPr.isDisabled = false;
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
          customPractice.setCurrentTrack(groupId);
          vmPr.questionAnalytics = (vmPr.activeGroupId === 'gmat' || vmPr.activeGroupId === 'act' || vmPr.activeGroupId === 'sat' || vmPr.activeGroupId === 'gre');
        }
      });
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
            vmPr.totalAnswered = timingData.total_answered;
            var mergedList = _.map(vmPr.items, function(item) {
              return _.extend(item, _.findWhere(timingData.answers, {
                'answer_id': item.id
              }));
            });

            var percentAnswered = (timingData.total_answered_correctly / timingData.total_answered) * 100;
            vmPr.percentAnswered = percentAnswered > 0 ? Math.round(percentAnswered.toFixed(2)) : 0;

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
      getNewPracticeGame: function(apiUrl) {
        practiceResource.createNewGame(apiUrl).then(function(game) {
          if (angular.isDefined(game) && game !== null) {
            customPractice.getQuestions();
            timerObject.initPracticeTimer();
            timerObject.initQuestionTimer();
          }
        });
      },
      getQuestions: function(){
        practiceResource.setQuestionsData(vmPr.activeGroupId,vmPr.activeTrack.subject.id,vmPr.activeTrack.subject.type)
        .then(setQuestionComplete);
          function setQuestionComplete(response){
              if(response)
                customPractice.presentQuestion();
              else
                practiceUtilities.usersRunOutQuestions(vmPr.activeTrack.subject.name, vmPr.activeGroupId);
          }
      },
      presentQuestion: function() {
        var requestLocalData = practiceResource.getQuestionData();
        if (requestLocalData !== null) {
          var questionData = practiceUtilities.presentQuestion(requestLocalData);

          if (angular.isDefined(questionData)) {

            practiceResource.getRoundSession(questionData.id, vmPr.activeGroupId).then(function(result) {
              vmPr.roundSessionAnswer = result;
            });
            vmPr.questionData = questionData;
            vmPr.answerType = practiceUtilities.getAnswerType(questionData.kind);

            vmPr.items = [];
            vmPr.maxOpts = [];
            vmPr.items = questionData.items;
            vmPr.loading = false;
            timerObject.resetQuestionTimer();
            customPractice.feedbackInfo(questionData.id);
            if (vmPr.questionAnalytics) {
              timerObject.setTimingInformation(questionData.id, questionData.kind);
            }
          }
        } else {
          vmPr.loading = true;
          customPractice.getQuestions();
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
          vmPr.questionData.setLayoutOneColumn = true;
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
        options.groupId = vmPr.activeGroupId;

        vmPr.answerStatus = practiceUtilities.numericEntryConfirmChoice(options);
        if (angular.isDefined(vmPr.answerStatus)) {
          vmPr.questionData.setLayoutOneColumn = true;
          this.resetLayout();
          customPractice.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        } else
        vmPr.isDisabled = false;
      },
      feedbackInfo: function(questionId) {
        vmPr.subjectMail = practiceUtilities.setMailToInformation(questionId, vmPr.activeTrack.subject.name);
      },
      nextQuestion: function() {
        this.presentQuestion();
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
        vmPr.answerStatus = practiceUtilities.confirmChoice(vmPr.questionData, vmPr.roundSessionAnswer, vmPr.items, vmPr.questionData.kind, vmPr.activeGroupId);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          vmPr.questionData.setLayoutOneColumn = true;
          customPractice.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        } else
        vmPr.isDisabled = false;
      },
      resetLayout: function() {
        vmPr.nextActionTitle = 'Next Question';
        practiceUtilities.resetLayout();
      },
      setCurrentTrack: function(groupId) {

        practiceUtilities.setCurrentTrack(groupId).then(function(response) {
          if (response) {
            vmPr.activeTrack = response;
            customPractice.getNewPracticeGame(vmPr.activeTrack.subject.url);
            vmPr.breadcrumbs = breadcrumbs;
            breadcrumbs.options = {
              'practice': vmPr.activeTrack.subject.name
            };
          }
        });
      }

    };
  }
})();
