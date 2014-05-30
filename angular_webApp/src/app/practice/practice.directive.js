/**
 * Created by Jose on 5/9/14.
 */

// Start Directives

app.directive('ngOneChoice', function(oneChoiceFactory) {
    return {
        restrict: 'A',
        templateUrl : 'app/practice/practiceDirectivesTemplates/oneChoice.tpl.html',
        link: function(scope) {
            oneChoiceFactory.execute();
           scope.$watch('nextActionTitle', function() {


           });

        },
        scope: {
            items:'=items',
            showExplanation:'='
        }
    };
})

    .directive('ngMultipleChoice', function(multipleChoiceFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/multipleChoice.tpl.html',
            link: function() {
                multipleChoiceFactory.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'='
            }
        };
    })

    .directive('ngMultipleMatrix2x3', function(matrix2x3ChoiceFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/matrix2x3.tpl.html',
            link: function() {
                matrix2x3ChoiceFactory.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'='
            }
        };
    })

    .directive('ngMultipleMatrix3x3', function(matrix3x3ChoiceFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/matrix3x3.tpl.html',
            link: function() {
                matrix3x3ChoiceFactory.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'='
            }
        };
    })

    .directive('ngSat', function() {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/sat.tpl.html',
            link: function() {
            },
            scope: {
                items:'=items',
                cols:'=cols'
            }
        };
    })

    .directive('ngNumericEntry', function() {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/numericEntry.tpl.html',
            link: function() {
            },
            scope: {
                items:'=items',
                showExplanation:'='
            }
        };
    })

    .directive('ngFractionEntry', function() {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/fractionEntry.tpl.html',
            link: function() {

            },
            scope: {
                items:'=items'
            }
        };
    })

// Ending Directives



//testing
    .directive('ngMultipleChoiceTwo', function() {

        return {
            restrict: 'A',
            template :  multipleChoiceTemplate(),
            link: function() {
                multipleAnswerMultipleChoiceTwoCorrect();
            },
            scope: {
                items:'=items'
            }
        };
    });

