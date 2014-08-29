practiceGame.directive('oneChoice', function (questionTypesService) {
  return {
    restrict: 'A',
    templateUrl: 'app/practiceGame/common/directives.tpl/oneChoice.tpl.html',
    link: function (scope) {
      scope.selectAnswer= function(index){

      };

      questionTypesService.oneChoiceFactory();
    },
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&'
    }
  };
})

  .directive('multipleChoice', function (questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/multipleChoice.tpl.html',
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

  .directive('multipleMatrix2x3', function (questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/matrix2x3.tpl.html',
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

  .directive('multipleMatrix3x3', function (questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/matrix3x3.tpl.html',
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

  .directive('sat', function (questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/sat.tpl.html',
      link: function () {
        questionTypesService.satFactory();
      },
      scope: {
      }
    };
  })

  .directive('numericEntry', function (questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/numericEntry.tpl.html',
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

  .directive('fractionEntry', function (questionTypesService) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/fractionEntry.tpl.html',
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

  .directive('twoChoice', function (questionTypesService) {

    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/twoChoice.tpl.html',
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

  .directive('ngCustomTopics', function () {

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

  .directive('questionTiming', function () {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/questionTiming.tpl.html',
      scope: {
        data: '=',
        yourTime: '=',
        answerStatus: '=',
        percentAnswered:'=',
        confirmed:'=',
        xpTag: '=',
        lastAnswerLoaded:'='
      },
      link: function (scope) {
        scope.showPercAnswered = !(scope.lastAnswerLoaded==='NumericEntry' || scope.lastAnswerLoaded === 'NumericEntryFraction');

        scope.compAvgStatus = ((scope.yourTime - scope.data.avg_time_to_answer) > 0);

        if (scope.compAvgStatus)
          scope.compAvg = (scope.yourTime - scope.data.avg_time_to_answer);
        else
          scope.compAvg = -(scope.yourTime - scope.data.avg_time_to_answer);

      }
    };
  })

  .directive('questionTagsOnly', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/practiceGame/common/directives.tpl/questionsTagsOnly.tpl.html',
      scope: {
        tags: '='
      }
    };
  })
  .directive('questionTags', function () {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/questionsTags.tpl.html',
      scope: {
        tags: '='
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
        case 'SPR':
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

      scope.$watch('lastAnswerLoaded', function (value) {

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
  })

  .directive('questionShareList', function (environmentCons) {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/questionShareList.tpl.html',
      scope: {
        questCount: '=',
        currentGroup:'='
      },
      link: function(scope){
        scope.currentDomain= environmentCons.localGrockit +'#/'+scope.currentGroup +'/question/';
      }

    };
  })

  .directive('questionCount', function() {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/questionCount.tpl.html',
      scope: {
        currentCount: '=',
        maxCount: '='
      }
    }
  })

  .directive('splashMessage', function() {
    return {
      restrict: 'A',
      templateUrl: 'app/practiceGame/common/directives.tpl/splash-message.tpl.html',
      scope: {
        isVisible: '=',
        word:'='
      }

    };
  });

