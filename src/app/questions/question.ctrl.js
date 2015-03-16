(function() {
  angular
  .module('grockitApp.question')
  .controller('QuestionController', QuestionController);

  /*Manual injection to avoid minification or injection problems*/
  QuestionController.$inject = ['$scope', 'practiceUtilities', 'utilities', 'breadcrumbs', 'alerts', 'Timer', 'SplashMessages', 'currentProduct', 'practiceResource'];

  function QuestionController($scope, practiceUtilities, utilities, breadcrumbs, alerts, Timer, SplashMessages, currentProduct, practiceResource) {
    /* jshint validthis: true */
    var vmPr = this,
    questionObserver = null;

    vmPr.breadcrumbs = breadcrumbs;
        /*breadcrumbs.options = {
      'practice': vmPr.activeTrack.subject.name
    };*/
    vmPr.questionData= {};
    vmPr.isbuttonClicked = false;
    vmPr.maxOpts = [];
    vmPr.explanationInfo = {};
    vmPr.videoInfo = {};
    vmPr.portalC = vmPr;
    vmPr.loading = true;
    vmPr.nextActionTitle = 'Confirm Choice';
    vmPr.answerStatus = null;
    vmPr.explanationInfo.showExplanation = false;
    vmPr.videoInfo.showVideo = false;
    vmPr.loadingMessage = SplashMessages.getLoadingMessage();
    vmPr.revealExplanation = revealExplanation;
    vmPr.nextAction = nextAction;

    /*Takes care to unregister the group once the user leaves the controller*/
    $scope.$on("$destroy", function() {
      currentProduct.unregisterGroup(questionObserver);
    });

    init();



    function init() {
      questionObserver = currentProduct.observeGroupId().register(function(groupId) {
        if (vmPr.activeGroupId !== groupId) {
          vmPr.activeGroupId = groupId;
          vmPr.questionAnalytics = (vmPr.activeGroupId === 'gmat' || vmPr.activeGroupId === 'act' || vmPr.activeGroupId === 'sat' || vmPr.activeGroupId === 'gre');

          var questionId = utilities.getCurrentParam('questionId');
          if (angular.isDefined(questionId)) {
            Question.getQuestion(questionId);
          } else {
            alerts.showAlert('Oh sorry, We have problems to load your question, please let us know on feedback@grockit.com.', 'danger');
          }

        }

      });

    };

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


    var timerObject = {
      setTimingInformation: function(questionId, correctAnswerId, kind) {

        practiceResource.getTimingInformation(vmPr.activeTrack.trackId, vmPr.activeGroupId, questionId)
        .$promise.then(function(result) {
           var timingData = result[0];
            vmPr.showTiming = true;
            vmPr.timingData = timingData;
          if (kind === 'MultipleChoiceOneCorrect') {
            var mergedList = _.map(vmPr.items, function(item) {
              return _.extend(item, _.findWhere(result[0].answers, {
                'answer_id': item.id
              }));
            });

            var percentAnswered = (timingData.total_answered_correctly / timingData.total_answered) * 100
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
      },
      destroyTimers: function() {
        Timer.destroy(vmPr.practiceTimer);
        Timer.destroy(vmPr.questionTimer);

      }
    };

    var Question = {
      getQuestion: function(questionId) {
        practiceResource.getQuestionFromApi(questionId).then(function(questionResponse) {
          if(angular.isDefined(questionResponse)){
             practiceResource.setQuestionData(questionResponse);

             timerObject.initPracticeTimer();
             timerObject.initQuestionTimer();
             Question.presentQuestion();
          }
        });
      },
      presentQuestion: function() {

        var questionData = practiceUtilities.presentQuestion(practiceResource.getQuestionData());

        if (angular.isDefined(questionData)) {

          vmPr.questionData = questionData;

          practiceUtilities.setOneColumnLayout(vmPr.questionData);

          vmPr.answerType = practiceUtilities.getAnswerType(questionData.kind);

          vmPr.items = [];
          vmPr.maxOpts = [];
          vmPr.items = questionData.items;
          vmPr.loading = false;

          timerObject.resetQuestionTimer();
          Question.feedbackInfo(questionData.id);
          if (vmPr.questionAnalytics) {
          //  timerObject.setTimingInformation(questionData.id, questionData.kind);
          }
        }
      },
      bindExplanationInfo: function(info) {
        vmPr.explanationInfo = info;
      },
      bindVideoExplanationInfo: function() {
        practiceUtilities.getVideoExplanation(vmPr.questionData)
        .then(function(videoInfo) {
          vmPr.videoInfo = videoInfo;
        });
      },
      displayExplanationInfo: function() {
        var generalInfo = practiceUtilities.displayGeneralConfirmInfo(vmPr.questionData);
        Question.bindExplanationInfo(generalInfo);
        Question.bindVideoExplanationInfo(vmPr.questionData);
      },
      confirmAnswer: function() {
        vmPr.answerStatus = practiceUtilities.confirmChoice(vmPr.questionData, undefined, vmPr.items,vmPr.questionData.kind,vmPr.activeGroupId);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          vmPr.questionData.setLayoutOneColumn=true;
          Question.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        }
      },
      resetLayout: function() {
        angular.element('#nextAction').addClass('hide');
        practiceUtilities.resetLayout();
      },
      doNotKnowAnswer: function() {
        vmPr.userConfirmed = false;
        var generalResult = practiceUtilities.doNotKnowAnswer(vmPr.questionData);
        Question.bindVideoExplanationInfo(vmPr.questionData);
        if (angular.isDefined(generalResult)) {
          this.resetLayout();
          vmPr.questionData.setLayoutOneColumn=true;
          Question.bindExplanationInfo(generalResult);
          vmPr.isbuttonClicked = true;
        }
      },
      evaluateConfirmMethod: function() {
        vmPr.userConfirmed = true;
        switch (vmPr.questionData.kind) {
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
        options.lastAnswerLoaded = vmPr.questionData.kind;
        options.questionResult = vmPr.questionData;
        options.roundSessionAnswer = undefined;
        options.groupId = vmPr.activeGroupId;

        vmPr.answerStatus = practiceUtilities.numericEntryConfirmChoice(options);
        if (angular.isDefined(vmPr.answerStatus)) {
          this.resetLayout();
          vmPr.questionData.setLayoutOneColumn=true;
          Question.displayExplanationInfo();
          vmPr.isbuttonClicked = true;
        }

      },
      feedbackInfo: function(questionId) {
        vmPr.subjectMail = practiceUtilities.setMailToInformation(questionId, '');
      },
      nextQuestion: function() {
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
        angular.element('#PanelQuestion').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          angular.element(this).removeClass();
        });
      }

    };
  }

})();
