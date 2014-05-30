app.controller('PracticeController',['$scope','Questions',function($scope,Questions) {

    $scope.rows=[1,2,3,4,5,6,7,8,9,10];
    $scope.column=[1,2,3,4];

    var easyPieChartDefaults = {
        animate: 2000,
        scaleColor: false,
        lineWidth: 6,
        lineCap: 'square',
        size: 105,
        trackColor: '#e5e5e5'
    };
    angular.element('#easy-pie-chart-2').easyPieChart(easyPieChartDefaults);

    $scope.questionTemplates =
        [   { name: 'MultipleChoiceOneCorrect', url: 'app/practice/practiceModuleTemplates/oneCorrectQ.tpl.html'},
            { name: 'MultipleChoiceOneorMoreCorrect', url: 'app/practice/practiceModuleTemplates/multipleChoiceQ.tpl.html'},
            { name: 'MultipleChoiceMatrixTwoByThree', url: 'app/practice/practiceModuleTemplates/matrix2x3Q.tpl.html'},
            { name: 'MultipleChoiceMatrixThreeByThree', url: 'app/practice/practiceModuleTemplates/matrix3x3Q.tpl.html'},
            { name: 'NumericEntryFraction', url: 'app/practice/practiceModuleTemplates/fractionEntryQ.tpl.html'},
            { name: 'NumericEntry', url: 'app/practice/practiceModuleTemplates/numericEntryQ.tpl.html'},
            { name: 'sat', url: 'app/practice/practiceModuleTemplates/satQ.tpl.html'}
        ];

    //This list will be moved to a specific file
    $scope.optionList = ['A','B','C','D','E','F','G','H','I'];
    $scope.nextActionTitle='Confirm Choice';
    $scope.questionItems=[];
    $scope.items=[];
    $scope.showExplanation = false;
    $scope.showVideo = false;
    $scope.position=0;
    $scope.templateUrl = function() {
               $scope.actualView=$scope.questionTemplates[$scope.position].name;
        return $scope.questionTemplates[$scope.position].url;
    };

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

    function confirmChoice(){

        var selectedPosition='';
        //Get selected answers
        angular.element('.choice input:checkbox:checked').each(function () {
            selectedPosition = (this.checked ? $(this).val() : "");
        });

        if (selectedPosition!=='') {

            angular.element('#nextAction').removeClass('btn-primary').addClass('btn-success');
            $scope.nextActionTitle='Next Question';
            $scope.showExplanation = true;

            //Question Explanation
            $scope.questionExplanation=$scope.questionItems.explanation;

            if($scope.questionItems.youtube_video_id !==null){
                $scope.showVideo=true;
                $scope.videoId= $scope.questionItems.youtube_video_id ;
            }

            //Get answers from the previous request and Explain
            var answers = $scope.questionItems.answers;

            //Get the selected answers object
            var selectedAnswer = $.grep(answers,function (val) {
                return val.position == selectedPosition;
            })[0];

            if(angular.isDefined(selectedAnswer)){
                if(selectedAnswer.correct==true){

                    $scope.messageConfirmation='Your answer was correct';
                }
                else
                {
                    $scope.messageConfirmation='Your answer was incorrect';
                }
                angular.element('.choice button').addClass('btn-primary');
            }

        }
        else{
            bootbox.alert('Please select an option!');
        }
    }

    function nextQuestion(){
        if($scope.questionTemplates.length-1> $scope.position){
            $scope.showVideo = false;
            $scope.position++;
            $scope.loadQuestion();
            $scope.templateUrl();
            $scope.messageConfirmation='';
            $scope.showExplanation = false;
            $scope.nextActionTitle='Confirm Choice';
            angular.element('#nextAction').removeClass('btn-success').addClass('btn-primary hide');
            angular.element('#skipAction').removeClass('hide');
        }
    }

    //load a question at the first time
    $scope.loadQuestion = function(){

        angular.element('.choice.active').removeClass('active');
        Questions.one(getUrlQuestion()).get().then(function(questionResult){

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

    $scope.skipQuestion = function(){
        nextQuestion();
    }



}]);