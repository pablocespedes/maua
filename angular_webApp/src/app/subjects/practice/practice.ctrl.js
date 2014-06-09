app.controller('PracticeController',['$scope','Questions',function($scope,Questions) {
    $scope.optionList = ['A','B','C','D','E','F','G','H','I'];
    $scope.nextActionTitle='Confirm Choice';
    $scope.questionItems=[];
    $scope.items=[];
    $scope.showExplanation = false;
    $scope.showVideo = false;
    $scope.position=0;
    $scope.rows=[1,2,3,4,5,6,7,8,9,10];
    $scope.column=[1,2,3,4];

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


    var selectAnswerType = function(type) {

        return $.grep($scope.directives,function (val) {
            return val.type == type;
        })[0];

    }

    var getUrlQuestion= function(){

        switch($scope.position){
            case 0:
                return '75f93df0-a4ed-012e-035d-1231390ef981';
                break;
            case 1:
                return '69f3f390-a4ed-012e-035d-1231390ef981';
                break;
            case 2:
                return '37ef3dd0-9f89-012e-5ad5-1231390ef981';
                break;
            case 3:
                return '27e8ef70-a4eb-012e-0320-1231390ef981';
                break;
            case 4:
                return '2dfe7d20-a4eb-012e-0320-1231390ef981';
                break;
            case 5:
                return '2a79f190-9f89-012e-5ad5-1231390ef981';
                break;
            case 6:
                return 'c16b675b-4db3-c272-ded1-455be01d586e';
                break;
            case 7:
                return 'bde6fff0-30c7-012e-f7bc-1231390ef981';
                break;
        }

    };

    function SeeAnswer(){
         angular.element('#skipAction').addClass('hide');
         angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
         $scope.nextActionTitle='Next Question';
         $scope.showExplanation = true;

         //Question Explanation
         $scope.questionExplanation=$scope.questionItems.explanation;

         //video validation
         if($scope.questionItems.youtube_video_id !==null){
             $scope.showVideo=true;
             $scope.videoId= $scope.questionItems.youtube_video_id ;
         }

         //Get answers from the previous request and Explain
         var answers = $scope.questionItems.answers;

         //Work with the styles to shown result
         //define is some answer is bad.
         angular.element('.choice button').removeClass('btn-primary');

         angular.forEach(answers, function (value, key) {
                 var selectIdButton = '#' + value.position;
                 if (value.correct) {
                     angular.element(selectIdButton).addClass('btn-success');
                 }
         });

         angular.element(".choice *").prop('disabled', true);
     }

    function confirmChoice(){

        var selectedPosition='',selectedOptions=[];
        //Get selected answers
        angular.element('.choice input:checkbox[value=true]').each(function () {
            selectedPosition = $(this).attr('id');
            selectedOptions.push(selectedPosition);
        });

        if (selectedOptions.length>0) {
            angular.element('#skipAction').addClass('hide');
            angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
            $scope.nextActionTitle='Next Question';
            $scope.showExplanation = true;

            //Question Explanation
            $scope.questionExplanation=$scope.questionItems.explanation;

             //video validation
            if($scope.questionItems.youtube_video_id !==null){
                $scope.showVideo=true;
                $scope.videoId= $scope.questionItems.youtube_video_id ;
            }

            //Get answers from the previous request and Explain
            var answers = $scope.questionItems.answers;

            //Work with the styles to shown result
            //define is some answer is bad.
            var allFine=true;
            angular.element('.choice button').removeClass('btn-primary');

            angular.forEach(selectedOptions, function (value, key) {
                var selectedAnswer= $.grep(answers,function (val) {
                    return val.position == value;
                })[0];

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

            $scope.messageConfirmation= allFine==true? 'Your answer was correct': 'Your answer was incorrect';
            angular.element(".choice *").prop('disabled', true);
        }
        else{
            bootbox.alert('Please select an option!');
        }
    }

    function nextQuestion(){
        if($scope.directives.length-1> $scope.position){
            //Enable/disable answer section
            angular.element('.choice *').removeAttr('disabled');
            $scope.showVideo = false;
            $scope.position++;
            $scope.loadQuestion();
            $scope.messageConfirmation='';
            $scope.showExplanation = false;
            $scope.nextActionTitle='Confirm Choice';
            angular.element('#nextAction').removeClass('btn-success');
            angular.element('#skipAction').removeClass('hide');
        }
    }

    //load a question at the first time
    $scope.loadQuestion = function(){

        angular.element('.choice.active').removeClass('active');
        Questions.one(getUrlQuestion()).get().then(function(questionResult){
                $scope.currentA=  selectAnswerType(questionResult.kind).id;
                $scope.items=[];
                $scope.stimulus="";
                $scope.template= $scope.actualView;
                $scope.questionItems= questionResult;

                $scope.questionInformation=  $scope.questionItems.question_set.info;
                $scope.stimulus= $scope.questionItems.stimulus;

                var answers= $scope.questionItems.answers;
                angular.forEach(answers, function(value,index){
                    value["option"] = $scope.optionList[index];
                    $scope.items.push(value);
                });

        }).catch(function error(msg) {
            console.error(msg);
        });

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