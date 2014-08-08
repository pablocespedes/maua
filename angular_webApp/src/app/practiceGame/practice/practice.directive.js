
practiceGame.directive('oneChoice', function(questionTypesService) {
  return {
    restrict: 'A',
    templateUrl: 'app/practiceGame/practice/directives.tpl/oneChoice.tpl.html',
    link: function () {
      questionTypesService.oneChoiceFactory();
    },
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&'
    }
  };
})

.directive('multipleChoice', function(questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/multipleChoice.tpl.html',
      link: function () {
        questionTypesService.multipleChoiceFactory();
      },
      scope: {
        items: '=items',
        showExplanation: '=',
        hasExplanation: '&'
      }
    };
  })

.directive('multipleMatrix2x3', function(questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/matrix2x3.tpl.html',
      link: function () {
        questionTypesService.matrix2x3ChoiceFactory();
      },
      scope: {
        items: '=items',
        showExplanation: '=',
        hasExplanation: '&'
      }
    };
  })

.directive('multipleMatrix3x3', function(questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/matrix3x3.tpl.html',
      link: function () {
        questionTypesService.matrix3x3ChoiceFactory();
      },
      scope: {
        items: '=items',
        showExplanation: '=',
        hasExplanation: '&'
      }
    };
  })

.directive('sat', function(questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/sat.tpl.html',
      link: function () {
        questionTypesService.satFactory();
      },
      scope: {
      }
    };
  })

.directive('numericEntry', function(questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/numericEntry.tpl.html',
      scope: {
        items: '=items',
        showExplanation: '=',
        hasExplanation: '&',
        portal: '=',
        answerStatus: '='
      },

      link: function (scope) {
        questionTypesService.numericEntry(scope);
      }

    };
  })

.directive('fractionEntry', function(questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/fractionEntry.tpl.html',
      scope: {
        items: '=items',
        showExplanation: '=',
        hasExplanation: '&',
        portal: '=',
        answerStatus: '='

      },
      link: function (scope) {
        questionTypesService.fractionEntry(scope);
      }
    };
  })

.directive('twoChoice', function(questionTypesService) {

    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/twoChoice.tpl.html',
      link: function () {
        questionTypesService.multipleChoiceTwoCorrect();
      },
      scope: {
        items: '=items',
        showExplanation: '=',
        hasExplanation: '&'
      }
    };
  })

/*.directive('ngAnswers', function() {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/practice/directives.tpl/answers.tpl.html'

    };
  })*/

.directive('ngCustomTopics', function() {

    function setSelect2Settings() {
      var elm = $('#practice-list select');
      elm.select2({
        allowClear: true
      });

      elm.on("change", function (e) {
        if (e.added) {

          $(e.added.element).css("background", '#f4b04f');
        }
      });
    }

    function togglePanel() {

      $('.practice-settings-switcher').switcher({
        theme: 'square',
        on_state_content: '<span class="fa fa-check" style="font-size:11px;"></span>',
        off_state_content: '<span class="fa fa-times" style="font-size:11px;"></span>'
      });

      $('#practice-settings-toggler').click(function () {
        $('#practice-settings').toggleClass('open');
        return false;
      });

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
  })

  .directive('questionTiming', function() {
    return {
      restrict: 'A',
      replace:true,
      templateUrl: 'common/templates/directives/questionTiming.tpl.html',
      scope: {
        data: '='
      }
    };
  })

  .directive('questionTags', function() {
    return {
      restrict: 'A',
      replace:true,
      templateUrl: 'common/templates/directives/questionsTags.tpl.html',
      scope: {
        tags: '=',
        xp: '='
      }
    };
  })

  .directive('answerType', function ($compile) {

    var fractionTpl = '<div fraction-entry answer-status="answerStatus" ' +
        'portal="portalC" items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)" >' +
        '</div>',

      matrix2x3Tpl = '<div multiple-matrix2x3 items="items" show-explanation="showExplanation"' +
        'has-explanation="answerHasExplanation(index)"></div>',

      matrix3x3Tpl = ' <div multiple-matrix3x3 items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)"></div>',

      multipleChoiceTpl = '<div multiple-choice items="items" show-explanation="showExplanation" ></div>',

      numericEntryTpl = '<div numeric-entry answer-status="answerStatus" portal="portalC" items="items" ' +
        'show-explanation="showExplanation" has-explanation="answerHasExplanation(index)"></div>',

      oneChoiceTpl = '<div one-choice items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)"></div>',

      satTpl = ' <div sat></div>',

      twoChoiceTpl = '<div  two-choice items="items" show-explanation="showExplanation" ' +
        'has-explanation="answerHasExplanation(index)"></div>';

    var getAnswerTemplate = function (questionKind) {
      var template = '';

      switch (questionKind) {
        case 'MultipleChoiceOneCorrect':
          template = oneChoiceTpl;
          break;
        case 'MultipleChoiceOneOrMoreCorrect':
          template = multipleChoiceTpl;
          break;
        case 'MultipleChoiceMatrixTwoByThree':
          template = matrix2x3Tpl;
          break;
        case 'MultipleChoiceMatrixThreeByThree':
          template = matrix3x3Tpl;
          break;
        case 'NumericEntryFraction':
          template = fractionTpl;
          break;
        case 'NumericEntry':
          template = numericEntryTpl;
          break;
        case 'sat':
          template = satTpl;
          break;
        case 'MultipleChoiceTwoCorrect':
          template = twoChoiceTpl;
          break;

      }

      return template;
    };

    var linker = function (scope, element, attrs) {
      element.html(getAnswerTemplate(attrs.content)).show();
      $compile(element.contents())(scope);

      scope.$watch('lastAnswerLoaded', function(value){

        element.html(getAnswerTemplate(value)).show();
        $compile(element.contents())(scope);


      });

    };

    return {
      restrict: "A",
      replace: true,
      scope: false,
      link: linker
    };
  });


