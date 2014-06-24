practiceGame.controller('PracticeController',['$scope','Questions','Utilities','PracticeGames','$sce','RoundSessions',function($scope,Questions,Utilities,PracticeGames,$sce,RoundSessions) {


    $scope.activeTracks =Utilities.getActiveTrack();
    $scope.TitleQuest=$scope.activeTracks.trackTitle;
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

     //load a question at the first time
    function loadQuestion() {

        if($scope.QuestionSetList.length>0) {

            var setLayoutType=false,
                setPosition = $scope.setPosition,
                questionSetResult = $scope.QuestionSetList[setPosition],

                position = $scope.position,
                questionsCount = questionSetResult.questions.length;


            if (position < questionsCount) {
                var questionResult = questionSetResult.questions[position];
                $scope.currentQuestionId = questionResult.id;
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


                setLayoutType = angular.isDefined($scope.questionInformation) && $scope.questionInformation!=null && $scope.questionInformation!='' ? true : false;

                setLayoutBasedOnQuestionInfo(setLayoutType);
                $scope.stimulus = $scope.questionItems.stimulus;

                var answers = $scope.questionItems.answers;
                angular.forEach(answers, function (value, index) {
                    value["option"] = $scope.optionList[index];
                    $scope.items.push(value);
                });

                $scope.position++;
            }
            else {
                $scope.position=0;
                $scope.setPosition++;
                loadQuestion();
            }
        }

    }

    function SeeAnswer(){

         setLayoutBasedOnQuestionInfo(true);
         angular.element('#skipAction').addClass('hide');
         angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
         $scope.nextActionTitle='Next Question';
         $scope.showExplanation = true;

         //Question Explanation
         $scope.questionExplanation=$scope.questionItems.explanation;

         //video validation
         if($scope.questionItems.youtube_video_id !==null){
             $scope.showVideo=true;
             $scope.videoId = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.questionItems.youtube_video_id);
         }

         //Get answers from the previous request and Explain
         var answers = $scope.questionItems.answers;
         $scope.tags = $scope.questionItems.tags;
        $scope.xpTag =$scope.questionItems.experience_points;
         //Work with the styles to shown result
         //define is some answer is bad.
         angular.element('.choice button').removeClass('btn-primary');

         angular.forEach(answers, function (value, key) {
           var selectIdButton = '#' + value.id;
           if (value.correct) {
               angular.element(selectIdButton).addClass('btn-success');
           }
         });

         angular.element(".choice *").prop('disabled', true);
     }

    function confirmChoice(){

        var selectedPosition='',selectedOptions=[];
        setLayoutBasedOnQuestionInfo(true);

        //Get selected answers
        angular.element('.choice input[value=true]').each(function () {
            selectedPosition = $(this).attr('id');
            selectedOptions.push(selectedPosition);
        });

        if (selectedOptions.length>0) {
            //createAnswerResponse();
            angular.element('#skipAction').addClass('hide');
            angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
            $scope.nextActionTitle='Next Question';
            $scope.showExplanation = true;

            //Question Explanation
            $scope.questionExplanation=$scope.questionItems.explanation;

             //video validation
            if($scope.questionItems.youtube_video_id !==null){
                $scope.showVideo=true;
                $scope.videoId = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.questionItems.youtube_video_id );
            }

            //Get answers from the previous request and Explain
            var answers = $scope.questionItems.answers;
            $scope.tags = $scope.questionItems.tags;
            $scope.xpTag =$scope.questionItems.experience_points;

            //Work with the styles to shown result
            //define is some answer is bad.
            var allFine=true;
            angular.element('.choice button').removeClass('btn-primary');

            angular.forEach(selectedOptions, function (value, key) {
//
                var selectedAnswer=  Utilities.findInArray(value,answers,'id');

                if(angular.isDefined(selectedAnswer)) {
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

    function createAnswerResponse(answerId){
        var AnswersRequest =  RoundSessions.one();
        AnswersRequest.post('',{game_id:$scope.practiceGameResponse.id,question_id:$scope.currentQuestionId}).then(function(AnswerObject) {

         var RoundSession = AnswerObject.round_session,
             getCurrentRSession = AnswerObject.put('');


        }, function() {
            console.log("There was an error creating the Round Session");
        });
    }

    $scope.CreatePracticeGame= function(){
        if($scope.activeTracks.tracks.length > 0){
            var practiceGame =  PracticeGames.one();
            practiceGame.post('',{group_id:$scope.activeGroupId}).then(function(PracticeObject) {

                $scope.practiceGameResponse = PracticeObject.practice_game;
                PracticeObject.one($scope.practiceGameResponse.id,'sample').customGET('',{'tracks[]':$scope.activeTracks.tracks}).then(function(QuestionSetObject){
                    $scope.QuestionSetList= QuestionSetObject.question_sets;
                    loadQuestion();
                });


            }, function() {
                console.log("There was an error creating the Practice Game");
            });
        }
        else{
            bootbox.alert('You must select one track at least',function(){
                window.location.href='/#/'+$scope.activeGroupId+'/dashboard';
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