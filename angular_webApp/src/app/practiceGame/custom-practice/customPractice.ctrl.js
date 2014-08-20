practiceGame.controller('CustomPracticeController',['$scope','practiceSrv','Utilities','breadcrumbs','practiceRequests','Alerts','Timer',
  function($scope,practiceSrv,Utilities,breadcrumbs,practiceRequests,Alerts,Timer) {

    $scope.activeTracks = Utilities.getActiveTrack();
    $scope.titleQuest = $scope.activeTracks.trackTitle;
    $scope.activeGroupId = Utilities.getActiveGroup();
    $scope.breadcrumbs = breadcrumbs;
    breadcrumbs.options = { 'practice': $scope.titleQuest };

    $scope.portalC = $scope;
    $scope.loading = true;
    $scope.nextActionTitle = 'Confirm Choice';
    $scope.questionItems = [];
    $scope.practiceTimer='00:00';
    $scope.questionTimer='00:00';
    $scope.answerStatus = null;
    $scope.showExplanation = false;
    $scope.showVideo = false;
    $scope.setPosition = 0;
    $scope.position = 0;
    $scope.lastAnswerLoaded = '';


    var customPractice = {
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
          customPractice.resetQuestionTimer();
          customPractice.feedbackInfo(questionId);
          customPractice.setTimingInformation(questionId);
        });
      },
      confirmAnswer: function () {
        $scope.nextActionTitle = 'Next Question';
        $scope.answerStatus = practiceSrv.confirmChoice($scope.questionResult, $scope.roundSessionAnswer);
        if (angular.isDefined($scope.answerStatus)) {
          practiceSrv.displayGeneralConfirmInfo($scope.questionResult).then(function (generalInfo) {
            $scope.showExplanation = generalInfo.showExplanation;
            $scope.questionExplanation = generalInfo.questionExplanation;
            $scope.showVideo = generalInfo.showVideo;
            $scope.videoId = generalInfo.videoId;
            $scope.videoText = generalInfo.videoText;
            $scope.tags = generalInfo.tags;
            $scope.xpTag = generalInfo.xpTag;

          });
        }
      },
      resetLayout: function () {
        $scope.titleQuest = '';
        $scope.titleQuest = $scope.activeTracks.trackTitle + ' Explanation';
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
            $scope.titleQuest = '';
            $scope.titleQuest = $scope.activeTracks.trackTitle;

            var setPosition = $scope.setPosition,

            /* Iterate between all the question sets retrieved it by the API */
              questionSetResult = $scope.questionSetList[setPosition];

            var position = $scope.position,
            /* questionsCount Give us the number of questions by questionSet*/
              questionsCount = questionSetResult.questions.length;
            $scope.questCount=questionsCount;
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
      doNotKnowAnswer: function(){
        this.resetLayout();
        practiceSrv.doNotKnowAnswer($scope.questionResult).then(function(result) {
          $scope.questionExplanation = result.questionExplanation;
          $scope.showExplanation = result.showExplanation;
          $scope.tagsResources = result.tagsResources;
          $scope.showVideo = result.showVideo;
          $scope.videoId = result.videoId;
          $scope.videoText = result.videoText;
          $scope.tags = result.tags;
          $scope.xpTag = result.xpTag;
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
      numericConfirmAnswer: function() {
        var options ={};
        options.numerator=$scope.numerator ;
        options.denominator = $scope.denominator;
        options.lastAnswerLoaded = $scope.lastAnswerLoaded;
        options.questionResult = $scope.questionResult;
        options.roundSessionAnswer = $scope.roundSessionAnswer;

        var result = practiceSrv.doNotKnowAnswer(options);
        $scope.answerStatus=result.messageConfirmation;
        $scope.messageConfirmation=result.messageConfirmation;

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
        angular.element('#answersPanels').removeClass().addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          angular.element(this).removeClass();
        });

      },
      setTimingInformation: function(questionId){
        practiceSrv.getTimingInformation($scope.activeTracks.tracks,$scope.activeGroupId,questionId).then(function(result){
          $scope.timingData= result[0];
          console.log($scope.timingData)
        })
      },
      initPracticeTimer: function(){
        $scope.practiceTimer = Timer.create();
      },
      initQuestionTimer: function(){
        $scope.questionTimer = Timer.create();
      },
      resetQuestionTimer: function(){
        $scope.questionTimer.reset();
        $scope.questionTimer.start();
        customPractice.restartPracticeTimer();
      },
      restartPracticeTimer: function(){
        $scope.practiceTimer.start();
      },
      pauseTimers: function(){
        $scope.practiceTimer.pause();
        $scope.questionTimer.pause();
      },
      feedbackInfo: function(questionId){
        $scope.subjectMail= practiceSrv.setMailToInformation(questionId,$scope.titleQuest);
      }
    };

    $scope.CreateNewGame = function () {

      var createGame = practiceRequests.practiceGames().createNewPracticeGame($scope.activeGroupId);

      createGame.then(function (game) {
        $scope.gameId = game.data.practice_game.id;

        customPractice.getQuestionSets();
        customPractice.initPracticeTimer();
        customPractice.initQuestionTimer();

      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');

      });


    };

    $scope.answerHasExplanation = function (index) {
      var answer = $scope.questionResult.answers[index];
      return !(answer.explanation == null || angular.isUndefined(answer.explanation) || answer.explanation == '');

    };

    $scope.nextAction = function () {
      customPractice.pauseTimers();
      if ($scope.nextActionTitle == 'Confirm Choice') {
        customPractice.evaluateConfirmMethod();
      }
      else {
        customPractice.nextQuestion();
      }
    };

    $scope.revealExplanation = function () {
      customPractice.pauseTimers();
      customPractice.doNotKnowAnswer();
    };

    $scope.CreateNewGame();

  }]);