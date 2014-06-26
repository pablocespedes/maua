practiceGame.controller('PracticeController',['$scope','Questions','Utilities','PracticeGames','$sce','RoundSessions','Headers',function($scope,Questions,Utilities,PracticeGames,$sce,RoundSessions,Headers) {


    $scope.activeTracks =Utilities.getActiveTrack();
    $scope.titleQuest=$scope.activeTracks.trackTitle;
    $scope.activeGroupId= Utilities.getActiveGroup();


    $scope.optionList = ['A','B','C','D','E','F','G','H','I'];
    $scope.nextActionTitle='Confirm Choice';
    $scope.questionItems=[];
    $scope.items=[];
    $scope.showExplanation = false;
    $scope.showVideo = false;
    $scope.setPosition=0;
    $scope.position=0;
    $scope.lastAnswerLoaded='';
    $scope.directives =
        [   { id:'1', type: 'MultipleChoiceOneCorrect'},
            { id:'2', type: 'MultipleChoiceOneOrMoreCorrect'},
            { id:'3', type: 'MultipleChoiceMatrixTwoByThree'},
            { id:'4', type: 'MultipleChoiceMatrixThreeByThree'},
            { id:'5', type: 'NumericEntryFraction'},
            { id:'6', type: 'NumericEntry'},
            { id:'7', type: 'sat'},
            {id:'8', type: 'MultipleChoiceTwoCorrect'}
        ];
    /* Load a question at the first time*/
    function loadQuestion() {

        /**/
        if($scope.QuestionSetList.length>0) {
            $scope.titleQuest=$scope.activeTracks.trackTitle;
            var setLayoutType=false,
                setPosition = $scope.setPosition,

               /* Iterate between all the question sets retrieved it by the API */
                questionSetResult = $scope.QuestionSetList[setPosition],

                position = $scope.position,
                questionsCount = questionSetResult.questions.length;


            if (position < questionsCount) {

                /* Iterate between all the question retrieved it by the API which belong to a specific Question set */
                var questionResult = questionSetResult.questions[position];

                /*Create Round Session by Question*/
                RoundSessions.one().post('',{game_id:$scope.practiceGameResponse.id,question_id:questionResult.id}).then(function(result) {
                    $scope.answerObject = result.data;
                     $scope.roundSessionAnswer = $scope.answerObject.round_session;

                    angular.element('.choice.active').removeClass('active');

                    if($scope.lastAnswerLoaded=='' || $scope.lastAnswerLoaded!=questionResult.kind){
                        $scope.currentA = Utilities.findInArray(questionResult.kind, $scope.directives, 'type').id;
                        $scope.lastAnswerLoaded=questionResult.kind;
                    }

                    $scope.items = [];
                    $scope.stimulus = "";
                    $scope.template = $scope.actualView;
                    $scope.questionItems = questionResult;

                    $scope.questionInformation = questionSetResult.info;

                    /*Find if there is a question info defined or retrieve it by the API*/
                    setLayoutType = angular.isDefined($scope.questionInformation) && $scope.questionInformation!=null && $scope.questionInformation!='' ? true : false;

                    setLayoutBasedOnQuestionInfo(setLayoutType);
                    $scope.stimulus = $scope.questionItems.stimulus;


                    var answers = $scope.questionItems.answers;
                    angular.forEach(answers, function (value, index) {
                        value["option"] = $scope.optionList[index];
                        $scope.items.push(value);
                    });

                    $scope.position++;
                }, function() {
                    console.log("There was an error creating the Round Session");
                });


            }
            else {
                $scope.position=0;
                $scope.setPosition++;
                loadQuestion();
            }
        }
        else{

          var dialogOptions  = {
              message: "Sorry, we can't show you questions for this topic yet. We're still working on them and should have them ready soon. " +
                       "Please select a different topic for now or also you can answer" +''+
                      " questions in the old Grockit.. Thanks.",
              buttons: {
                  success: {
                      label: "Stay on New Grockit!",
                      className: "btn-success",
                      callback: function () {
                          Utilities.redirect('#/' +  $scope.activeGroupId + '/dashboard');
                      }
                  },
                  main: {
                      label: "Continue to Original Grockit!",
                      className: "btn-primary",
                      callback: function () {
                          var url = Utilities.originalGrockit().url+'/'+ $scope.activeGroupId;
                          Utilities.redirect(url);
                      }
                  }
              }
          };

            Utilities.dialogService(dialogOptions);
        }

    }

    function SeeAnswer(){
         $scope.titleQuest=$scope.titleQuest+ ' Explanation';
         setLayoutBasedOnQuestionInfo(true);
         angular.element('#skipAction').addClass('hide');
         angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
         $scope.nextActionTitle='Next Question';

        /*Question Explanation*/
        $scope.questionExplanation=$scope.questionItems.explanation;

        if($scope.questionExplanation!=null)
           $scope.showExplanation = true;


         /*video validation*/
         if($scope.questionItems.youtube_video_id !==null){
             $scope.showVideo=true;
             $scope.videoId = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.questionItems.youtube_video_id);
         }

         /*Get answers from the previous request and Explain*/
         var answers = $scope.questionItems.answers;
         $scope.tags = $scope.questionItems.tags;
         $scope.xpTag =$scope.questionItems.experience_points;


      /*   Work with the styles to shown result
         define is some answer is bad.*/
         angular.element('.choice button').removeClass('btn-primary');

         angular.forEach(answers, function (value, key) {
           $scope['showExplanation'+value.id] = value.explanation != null ? true : false;
           var selectIdButton = '#' + value.id;
           if (value.correct) {
               angular.element(selectIdButton).addClass('btn-success');
           }
         });

         angular.element(".choice *").prop('disabled', true);
     }

    function confirmChoice(){
        $scope.titleQuest=$scope.titleQuest+ ' Explanation';
        var selectedPosition='',selectedOptions=[];
        setLayoutBasedOnQuestionInfo(true);

        /*Get selected answers*/
        angular.element('.choice input[value=true]').each(function () {
            selectedPosition = $(this).attr('id');
            selectedOptions.push(selectedPosition);
        });

        if (selectedOptions.length>0) {


            angular.element('#skipAction').addClass('hide');
            angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
            $scope.nextActionTitle='Next Question';

            /* Question Explanation*/
            $scope.questionExplanation=$scope.questionItems.explanation;

            if($scope.questionExplanation!=null)
                $scope.showExplanation = true;


            /* video validation*/
            if($scope.questionItems.youtube_video_id !==null){
                $scope.showVideo=true;
                $scope.videoId = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.questionItems.youtube_video_id );
            }

            /*Get answers from the previous request and Explain*/
            var answers = $scope.questionItems.answers;
            $scope.tags = $scope.questionItems.tags;
            $scope.xpTag =$scope.questionItems.experience_points;

           /* Work with the styles to shown result
            define is some answer is bad.*/
            var allFine=true;
            angular.element('.choice button').removeClass('btn-primary');

            angular.forEach(selectedOptions, function (value, key) {

                var selectedAnswer=  Utilities.findInArray(value,answers,'id');

                if(angular.isDefined(selectedAnswer)) {

                    /*Send answer response to server*/
                   $scope.answerObject.one($scope.roundSessionAnswer.id).put({answer_id: selectedAnswer.id });

                        /*selectIdButton Find the letter button to apply class depending if it's correct or not*/
                        var selectIdButton = '#' + selectedAnswer.position;
                        if (!selectedAnswer.correct) {
                            allFine = false;
                            angular.element(selectIdButton).addClass('btn-danger');
                        }
                        else {
                            angular.element(selectIdButton).addClass('btn-success');
                        }

                }
                else{
                    bootbox.alert('Something wrong getting your response, please try it again.!');
                }

            });

            $scope.messageConfirmation= allFine ? 'Your answer was correct': 'Your answer was incorrect';
            angular.element(".choice *").prop('disabled', true);
        }
        else{
            bootbox.alert('Please select an option!');
        }
    }

    function nextQuestion() {
        //Enable/disable answer section
        angular.element('.choice *').removeClass('btn-primary btn-danger btn-success').removeAttr('disabled');
        $scope.showVideo = false;
        $scope.messageConfirmation = '';
        $scope.showExplanation = false;
        $scope.nextActionTitle = 'Confirm Choice';
        angular.element('#nextAction').removeClass('btn-success');
        angular.element('#skipAction').removeClass('hide');
        loadQuestion();
    }

    function setLayoutBasedOnQuestionInfo(setLayout){
        var panel1 = angular.element('#Panel1'),
            panel2 = angular.element('#Panel2');

        if(setLayout){
            panel1.removeClass('col-md-offset-3');
            panel2.removeClass('col-md-offset-3');
        }
        else{
            panel1.addClass('col-md-offset-3');
            panel2.addClass('col-md-offset-3');
        }
    }


    $scope.CreatePracticeGame= function(){
        if($scope.activeTracks.tracks.length > 0){
            var practiceGame =  PracticeGames.one();
            practiceGame.post('',{group_id:$scope.activeGroupId}).then(function(result) {
                var PracticeObject = result.data;
                $scope.practiceGameResponse = PracticeObject.practice_game;
                PracticeObject.one($scope.practiceGameResponse.id,'sample').customGET('',{'tracks[]':$scope.activeTracks.tracks}).then(function(result){
                    var QuestionSetObject= result.data;
                    $scope.QuestionSetList= QuestionSetObject.question_sets;
                    loadQuestion();
                });


            }, function() {
                console.log("There was an error creating the Practice Game");
            });
        }
        else{
            bootbox.alert('You must select one track at least',function(){
                Utilities.redirect('#/' +  $scope.activeGroupId+ '/dashboard');
            });
        }

    };

    //confirm choice
    $scope.nextAction = function() {
        if($scope.nextActionTitle=='Confirm Choice'){
            confirmChoice();
        }
        else{
            nextQuestion();
        }

    };

    $scope.revealExplanation = function(){
        SeeAnswer();
    };


}]);