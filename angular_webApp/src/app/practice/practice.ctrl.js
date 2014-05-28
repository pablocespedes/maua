app.controller('PracticeController',['$scope', 'getApiUrlRequest','ApiRequest',function($scope,getApiUrlRequest,ApiRequest) {


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
    $scope.questionItems=[];
    $scope.items=[];
    $scope.showExplanation = false;

    $scope.position=0;
    $scope.templateUrl = function() {
               $scope.actualView=$scope.questionTemplates[$scope.position].name;
        return $scope.questionTemplates[$scope.position].url;
    };

    var getUrlQuestion= function(request){

        switch($scope.actualView){
            case 'MultipleChoiceOneCorrect':
                return request.MultipleChoiceOneCorrect;
                break;
            case 'MultipleChoiceOneorMoreCorrect':
                return request.MultipleChoiceOneorMoreCorrect;
                break;
            case 'mChoiceTwoCorrects':
                return request.MultipleChoiceTwoCorrect;
                break;
            case 'MultipleChoiceMatrixTwoByThree':
                return request.MultipleChoiceMatrixTwoByThree;
                break;
            case 'MultipleChoiceMatrixThreeByThree':
                return request.MultipleChoiceMatrixThreeByThree;
                break;
            case 'NumericEntry':
                return request.NumericEntry;
                break;
            case 'NumericEntryFraction':
                return request.NumericEntryFraction;
                break;
            case 'SPR':
                return request.SPR;
                break;
        }

    };

    //load a question at the first time
    $scope.loadQuestion = function(){

        angular.element('.choice.active').removeClass('active');
        getApiUrlRequest.get().then(function(objUrl){

            var config = {
                    method: "GET",
                    contentType: "application/json",
                    base: '',
                    isArray: false,
                    data:''
                },
                requestUrl= objUrl.baseURL+getUrlQuestion(objUrl.request);

            ApiRequest.doRequest(config,requestUrl).then(function(contentResponse){
                if(contentResponse.$resolved==true){
                    $scope.items=[];
                    $scope.stimulus="";
                    $scope.template= $scope.actualView;
                    $scope.questionItems= contentResponse;


                    var answers= $scope.questionItems.answers;
                    $scope.stimulus= $scope.questionItems.stimulus;
                    $scope.questionInformation=  $scope.questionItems.question_set.info;
                    angular.forEach(answers, function(value,index){
                        value["option"] = $scope.optionList[index];
                        $scope.items.push(value);
                    });
                }
            });
        });
    };

    //confirm choice
    $scope.confirmChoice = function() {
        var selectedPosition='';
        //Get selected answers
        angular.element('.choice input:checkbox:checked').each(function () {
            selectedPosition = (this.checked ? $(this).val() : "");
        });

        if (selectedPosition!=='') {
            $scope.showExplanation = true;

            //Question Explanation
            $scope.questionExplanation=$scope.questionItems.explanation;

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
    };

    $scope.skipQuestion = function(){
        if($scope.questionTemplates.length-1> $scope.position){
            $scope.position++;
            $scope.loadQuestion();
            $scope.templateUrl();
            $scope.messageConfirmation='';
            $scope.showExplanation = false;
        }

    }



}]);