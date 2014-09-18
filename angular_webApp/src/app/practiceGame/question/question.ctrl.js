practiceGame.controller('QuestionController',['$scope','practiceSrv','Utilities','breadcrumbs','Alerts','practiceRequests','Timer', 'SplashMessages',
  function($scope,practiceSrv,Utilities,breadcrumbs,Alerts,practiceRequests,Timer, SplashMessages) {

    $scope.activeTracks = Utilities.getActiveTrack();
    $scope.questionAnalytics = ($scope.activeGroupId === 'gmat' || $scope.activeGroupId === 'act' || $scope.activeGroupId === 'sat' || $scope.activeGroupId === 'gre');

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
    $scope.loadingMessage = SplashMessages.getLoadingMessage();

    var timer = {
      setTimingInformation: function (questionId, correctAnswerId,lastAnswerLoaded) {
        practiceSrv.getTimingInformation($scope.activeTracks.tracks, $scope.activeGroupId, questionId).$promise.then(function (result) {
          $scope.showTiming=true;
          $scope.timingData = result[0];

          if (lastAnswerLoaded === 'MultipleChoiceOneCorrect') {
              var mergedList = _.map($scope.items, function(item) {
                return _.extend(item, _.findWhere(result[0].answers, {
                  'answer_id': item.id
                }));
              });

              $scope.percentAnswered = Utilities.findInCollection(result[0].answers, {
                'answer_id': correctAnswerId
              }).percent_answered;
            }
        }).catch(function (e) {
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
      },
      destroyTimers: function(){
        Timer.destroy($scope.practiceTimer);
        Timer.destroy($scope.questionTimer);

      }
    };

    var Question = {
      bindExplanationInfo: function (info) {
        $scope.showExplanation = info.showExplanation;
        $scope.questionExplanation = info.questionExplanation;
        $scope.tagsResources = info.tagsResources;
        $scope.tags = info.tags;
        $scope.xpTag = info.xpTag;
      },
      bindVideoExplanationInfo: function(){
        practiceSrv.getVideoExplanation($scope.questionResult).then(function (videoInfo) {
          $scope.showVideo = videoInfo.showVideo;
          $scope.videoId = videoInfo.videoId;
          $scope.videoText = videoInfo.videoText;
        });
      },
      presentQuestion: function (questionId) {



        practiceSrv.loadQuestion(questionId).then(function (result) {

          var questionSet = result.questionResult.question_set,
              createGame = practiceRequests.practiceGames().createNewGameSubtrack($scope.activeGroupId,
                         questionSet.subtrack_id);
            createGame.then( function(resultGame){
                return practiceSrv.getRoundSession(questionId,resultGame.data.practice_game.id);
            }).then( function(roundResult){
                $scope.roundSessionAnswer = roundResult.roundSessionAnswer;
            })

          $scope.questionResult = result.questionResult;
          $scope.lastAnswerLoaded = result.lastAnswerLoaded;
          $scope.questionInformation = result.questionInformation;
          $scope.stimulus = result.stimulus;
          $scope.items = [];
          $scope.items = result.items;
          $scope.loading = false;
          $scope.position++;

          /*find correct answer to be send to timing section*/
          var correctAnswerId = Utilities.findInCollection(result.questionResult.answers, { 'correct': true }).id;
          timer.resetQuestionTimer();
          Question.feedbackInfo(questionId);
          if($scope.questionAnalytics)
          timer.setTimingInformation(questionId, correctAnswerId, $scope.lastAnswerLoaded);
        });
      },
      displayExplanationInfo: function () {
        var generalInfo= practiceSrv.displayGeneralConfirmInfo($scope.questionResult);
        Question.bindExplanationInfo(generalInfo);
        Question.bindVideoExplanationInfo($scope.questionResult);
      },
      confirmAnswer: function () {
        $scope.answerStatus = practiceSrv.confirmChoice($scope.questionResult, $scope.roundSessionAnswer,$scope.items);
        if (angular.isDefined($scope.answerStatus)) {
          this.resetLayout();
          Question.displayExplanationInfo();

        }
      },
      resetLayout: function () {
        angular.element('#nextAction').addClass('hide');
        practiceSrv.resetLayout();
      },
      doNotKnowAnswer: function () {
         var generalResult = practiceSrv.doNotKnowAnswer($scope.questionResult);
         Question.bindVideoExplanationInfo($scope.questionResult);
        if (angular.isDefined(generalResult)) {
           this.resetLayout();
           Question.bindExplanationInfo(generalResult);
        }
      },
      evaluateConfirmMethod: function () {
        switch ($scope.lastAnswerLoaded) {
          case 'SPR':
          case 'NumericEntry':
          case 'NumericEntryFraction':
            Question.numericConfirmAnswer();
            break;
          default:
            Question.confirmAnswer();
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
        if (angular.isDefined($scope.answerStatus)) {
          this.resetLayout();
          Question.displayExplanationInfo();

        }

      },
      nextQuestion: function () {
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
        angular.element('#PanelQuestion').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          angular.element(this).removeClass();
        });
      },
      feedbackInfo: function (questionId) {
        $scope.subjectMail = practiceSrv.setMailToInformation(questionId,$scope.activeTracks.trackTitle);
      }

    };

    $scope.init = function () {

         var questionId = Utilities.getCurrentParam('questionId');

        if (angular.isDefined(questionId)) {
          Question.presentQuestion(questionId);
          timer.initPracticeTimer();
          timer.initQuestionTimer();
        }
        else {
          Alerts.showAlert('Oh sorry, We have problems to load your question, please let us know on feedback@grockit.com.', 'danger');
        }
    };

    $scope.answerHasExplanation = function (index) {
      var answer = $scope.questionResult.answers[index];
      return !(answer.explanation == null || angular.isUndefined(answer.explanation) || answer.explanation == '');

    };

    $scope.nextAction = function () {
      timer.pauseTimers();
      if ($scope.nextActionTitle == 'Confirm Choice') {
        Question.evaluateConfirmMethod();
      }
      else {
        timer.destroy();
      }

    };

    $scope.revealExplanation = function () {
      timer.pauseTimers();
      Question.doNotKnowAnswer();
    };

    $scope.init();


  }]);
