practiceGame.controller('QuestionController',['$scope','practiceSrv','Utilities','breadcrumbs','Alerts','practiceRequests',
  function($scope,practiceSrv,Utilities,breadcrumbs,Alerts,practiceRequests) {

    $scope.activeTracks = Utilities.getActiveTrack();
    $scope.titleQuest = $scope.activeTracks.trackTitle;
    $scope.activeGroupId = Utilities.getActiveGroup();
    $scope.breadcrumbs = breadcrumbs;
    breadcrumbs.options = { 'practice': $scope.titleQuest };

    $scope.portalC = $scope;
    $scope.loading = true;
    $scope.nextActionTitle = 'Confirm Choice';
    $scope.questionItems = [];

    $scope.answerStatus = null;
    $scope.showExplanation = false;
    $scope.showVideo = false;
    $scope.setPosition = 0;
    $scope.position = 0;
    $scope.lastAnswerLoaded = '';


    var Question = {
      showQuestion: function(questionId,gameId){
        practiceSrv.loadQuestion(questionId,gameId).then(function(result){
          $scope.questionResult=result.questionResult;
          $scope.roundSessionAnswer = result.roundSessionAnswer;
          $scope.lastAnswerLoaded = result.lastAnswerLoaded;
          $scope.questionInformation=result.questionInformation;
          $scope.stimulus=result.stimulus;
          $scope.items = [];
          $scope.items=result.items;

        });
      },
      confirmAnswer: function(){
        // $scope.nextActionTitle = 'Next Question';
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
        $scope.titleQuest = '';
        $scope.titleQuest = $scope.activeTracks.trackTitle + ' Explanation';
        practiceSrv.resetLayout();
      }
    };

    $scope.CreateNewGame = function () {

      var createGame = practiceRequests.practiceGames().createNewPracticeGame($scope.activeGroupId);

      createGame.then(function (game) {
        var gameResponseId = game.data.practice_game.id,
            questionId = Utilities.getCurrentParam('questionId');

        if (angular.isDefined(questionId)) {
          Question.showQuestion(questionId,gameResponseId);
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
        Question.confirmAnswer();
    };

    $scope.revealExplanation = function () {
      Practice.showAnswer();
    };

    $scope.CreateNewGame();


  }]);