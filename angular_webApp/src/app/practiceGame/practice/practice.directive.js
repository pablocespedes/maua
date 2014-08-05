
practiceGame.directive('ngOneChoice', function(questionTypesService) {
    return {
        restrict: 'A',
        templateUrl : 'app/practiceGame/practice/directives.tpl/oneChoice.tpl.html',
        link: function() {
            questionTypesService.oneChoiceFactory();
        },
        scope: {
            items:'=items',
            showExplanation:'=',
            hasExplanation: '&'
        }
    };
})

    .directive('ngMultipleChoice', function(questionTypesService) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/multipleChoice.tpl.html',
            link: function() {
                questionTypesService.multipleChoiceFactory();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngMultipleMatrix2x3', function(questionTypesService) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/matrix2x3.tpl.html',
            link: function() {
                questionTypesService.matrix2x3ChoiceFactory();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngMultipleMatrix3x3', function(questionTypesService) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/matrix3x3.tpl.html',
            link: function() {
                questionTypesService.matrix3x3ChoiceFactory();
            },
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&'
            }
        };
    })

    .directive('ngSat', function(questionTypesService) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/sat.tpl.html',
            link: function() {
                questionTypesService.satFactory();
            },
            scope: {
            }
        };
    })

    .directive('ngNumericEntry', function(questionTypesService) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/numericEntry.tpl.html',
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&',
                portal:'=',
                answerStatus:'='
            },

            link: function(scope) {
                questionTypesService.numericEntry(scope);
            }

        };
    })

    .directive('ngFractionEntry', function(questionTypesService) {
        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/fractionEntry.tpl.html',
            scope: {
                items:'=items',
                showExplanation:'=',
                hasExplanation: '&',
                portal:'=',
                answerStatus:'='

            },
            link: function(scope) {
                questionTypesService.fractionEntry(scope);
            }
        };
    })

    .directive('ngTwoChoice', function(questionTypesService) {

        return {
            restrict: 'A',
            templateUrl : 'app/practiceGame/practice/directives.tpl/twoChoice.tpl.html',
            link: function() {
                questionTypesService.multipleChoiceTwoCorrect();
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
    })

    .directive('ngCustomTopics', function() {

		function setSelect2Settings() {
				var elm = $('#practice-list select');
				elm.select2({
						allowClear: true
				});

				elm.on("change", function (e) {
						if (e.added) {
								// You can add other filters here like
								// if e.val == option_x_of_interest or
								// if e.added.text == some_text_of_interest
								// Then add a custom CSS class my-custom-css to the <li> added
								$(e.added.element).css("background", '#f4b04f');
								//$('.select2-search-choice').css("background",'#f4b04f');
						}
				});
		}

		function togglePanel() {

				$('.practice-settings-switcher').switcher({
						theme: 'square',
						on_state_content: '<span class="fa fa-check" style="font-size:11px;"></span>',
						off_state_content: '<span class="fa fa-times" style="font-size:11px;"></span>'
				});

				// Demo panel toggle
				$('#practice-settings-toggler').click(function () {
						$('#practice-settings').toggleClass('open');
						return false;
				});

				// Toggle switchers on label click
				$('#practice-settings-list li > span').click(function () {
						$(this).parents('li').find('.switcher').click();
				});

		}

		return {
				restrict: 'A',
				templateUrl: 'app/practiceGame/practice/directives.tpl/custom-practice.tpl.html',
				link: function () {
						setSelect2Settings();
						togglePanel();
				}

		};
});


