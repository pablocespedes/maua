practiceGame.controller('QuestionController',['$scope','practiceSrv','Utilities','breadcrumbs','Alerts','practiceRequests','Timer',
  function($scope,practiceSrv,Utilities,breadcrumbs,Alerts,practiceRequests,Timer) {

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


    var Question = {
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
          customPractice.setTimingInformation(questionId);
        });
      },
      confirmAnswer: function(){

        $scope.answerStatus = practiceSrv.confirmChoice($scope.questionResult,$scope.roundSessionAnswer);
        if(angular.isDefined($scope.answerStatus)){
          practiceSrv.displayGeneralConfirmInfo($scope.questionResult).then(function(generalInfo){
            $scope.showExplanation= generalInfo.showExplanation;
            $scope.questionExplanation= generalInfo.questionExplanation;
            $scope.showVideo = generalInfo.showVideo;
            $scope.videoId = generalInfo.videoId;
            $scope.videoText=generalInfo.videoText;
            $scope.tags=generalInfo.tags;
            $scope.xpTag=generalInfo.xpTag;

          });
        }
      },
      resetLayout: function () {
        angular.element('#nextAction').removeClass('hide');
        $scope.titleQuest = '';
        $scope.titleQuest = $scope.activeTracks.trackTitle + ' Explanation';
        practiceSrv.resetLayout();
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
            Question.numericEntryConfirmChoice();
            break;
          default:
            Question.confirmAnswer();
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
      feedbackInfo: function(questionId){
        $scope.subjectMail= practiceSrv.setMailToInformation(questionId,$scope.titleQuest);
      },
      initTimers: function(){
        $scope.practiceTimer = Timer.create();
        $scope.practiceTimer.start();
        $scope.questionTimer = Timer.create();
        $scope.questionTimer.start();
      },
      resetQuestionTimer: function(){
        $scope.questionTimer.reset();
        $scope.questionTimer.start();
        this.restartPracticeTimer();
      },
      restartPracticeTimer: function(){
        $scope.practiceTimer.start();
      },
      pausePracticeTimer: function(){
        $scope.practiceTimer.pause();
      },
      destroyTimers: function(){
       Timer.destroy( $scope.practiceTimer );
       Timer.destroy($scope.questionTimer);
      }
    };

    $scope.CreateNewGame = function () {

      var createGame = practiceRequests.practiceGames().createNewPracticeGame($scope.activeGroupId);

      createGame.then(function (game) {
        var gameResponseId = game.data.practice_game.id,
            questionId = Utilities.getCurrentParam('questionId');

        if (angular.isDefined(questionId)) {
          Question.presentQuestion(questionId,gameResponseId);
          Question.initTimers();
        }
        else {
          Alerts.showAlert('Oh sorry, We have problems to load your question, please let us know on feedback@grockit.com.', 'danger');
        }


      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');

      });


    };

    $scope.answerHasExplanation = function (index) {
      var answer = $scope.questionResult.answers[index];
      return !(answer.explanation == null || angular.isUndefined(answer.explanation) || answer.explanation == '');

    };

    $scope.nextAction = function () {
      Question.evaluateConfirmMethod();
        Question.destroyTimers();
    };

    $scope.revealExplanation = function () {
      Question.doNotKnowAnswer();
    };

    $scope.CreateNewGame();


  }]);