app.controller('PracticeController', function ($scope,$rootScope,getApiUrlRequest,ApiRequest) {
    $scope.actualView = angular.isDefined($rootScope.view)?$rootScope.view : 'mchoiceOnecorrect';

    //This list will be moved to a specific file
    $scope.optionList = ['A','B','C','D','E','F','G','H','I'];
    $scope.questionItems=[];
    $scope.items=[];
    var getUrlQuestion= function(request){

        switch($scope.actualView){
            case 'mchoiceOnecorrect':
                return request.MultipleChoiceOneCorrect;
                break;
            case 'mChoiceMultiple':
                return request.MultipleChoiceOneorMoreCorrect;
                break;
            case 'mChoiceTwoCorrects':
                return request.MultipleChoiceTwoCorrect;
                break;
            case 'mChoiceOne2x3Matrix':
                return request.MultipleChoiceMatrixTwoByThree;
                break;
            case 'mChoiceOne3x3Matrix':
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
        // $scope.stimulus=  "Select the ASSERTION from among the conclusion statements in the answer choices below:";
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

                    angular.forEach(answers, function(value,index){
                        value["option"] = $scope.optionList[index];
                        $scope.items.push(value);
                    });
                }
            });
        });
    };




});