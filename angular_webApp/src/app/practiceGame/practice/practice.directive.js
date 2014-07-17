
practiceGame.directive('ngOneChoice', function(oneChoiceFactory) {
    return {
        restrict: 'A',
        templateUrl : 'app/practiceGame/practice/directives.tpl/oneChoice.tpl.html',
        link: function() {
            oneChoiceFactory.execute();
        },
        scope: {
            items:'=items',
            showExplanation:'=',
            hasExplanation: '&'
        }
    };
})

    .directive('ngMultipleChoice', function(multipleChoiceFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/multipleChoice.tpl.html',
            link: function() {
                multipleChoiceFactory.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngMultipleMatrix2x3', function(matrix2x3ChoiceFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/matrix2x3.tpl.html',
            link: function() {
                matrix2x3ChoiceFactory.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngMultipleMatrix3x3', function(matrix3x3ChoiceFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/matrix3x3.tpl.html',
            link: function() {
                matrix3x3ChoiceFactory.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngSat', function(satFactory) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/sat.tpl.html',
            link: function() {
                satFactory.execute();
            },
            scope: {
            }
        };
    })

    .directive('ngNumericEntry', function(numericEntry) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/numericEntry.tpl.html',
            scope: {
                showExplanation:'=',
                portal:'=',
                answerExplanation:'='
            },

            link: function(scope,attrs) {
                numericEntry.execute(scope,attrs);
            }

        };
    })

    .directive('ngFractionEntry', function(fractionEntry) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/fractionEntry.tpl.html',
            scope: {
                showExplanation:'=',
                numerator:'=',
                denominator:'='

            },
            link: function(scope) {
                fractionEntry.execute(scope);
            }
        };
    })

    .directive('ngTwoChoice', function(multipleChoiceTwoCorrect) {

        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/twoChoice.tpl.html',
            link: function() {
                multipleChoiceTwoCorrect.execute();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngAnswers', function(){
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/answers.tpl.html'

        };
    });


