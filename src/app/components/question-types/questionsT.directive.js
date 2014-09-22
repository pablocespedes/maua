angular.module("grockitApp.components")
.directive('oneChoice', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/oneChoice.tpl.html',
    link: function(scope) {
      scope.selectAnswer = function(index) {
        if (!scope.isConfirmClicked) {
          _.forEach(scope.items, function(answer, i) {
            if (index != i) answer.selected = false;
          });

          var answer = scope.items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');

          $('.choice button').removeClass('btn-primary btn-danger');
          if (!answer.selected) {
            answer.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            answer.selected = false;
            nexAction.removeClass('btn-primary');
            seeAnswer.removeClass('hide');
          }
        }
      };
    },
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      isConfirmClicked: '='
    }
  };
})

.directive('multipleChoice', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/multipleChoice.tpl.html',
    link: function(scope) {
      scope.selectAnswer = function(index) {
        if (!scope.isConfirmClicked) {
          var answers = scope.items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');

          if (!answers.selected) {
            answers.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            answers.selected = false;
            if (!_.find(scope.items, {
              'selected': true
            })) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      };
    },
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      isConfirmClicked: '='
    }
  };
})

.directive('multipleMatrix2x3', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/matrix2x3.tpl.html',
    link: function(scope) {

      scope.selectAnswer = function(index, mGroup) {
        if (!scope.isConfirmClicked) {
          var answer = scope.items[index],
          answerId = answer.id,
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction'),
          currentSection = _.filter(scope.items, function(answer) {
            return answer.matrix_group == mGroup
          }),
          trueSelected = _.filter(currentSection, {
            'selected': true
          });

          if (trueSelected) {
            _.forEach(currentSection, function(answer) {
              if (answerId != answer.id) answer.selected = false;
            });
          }

          if (!answer.selected) {
            answer.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            answer.selected = false;
            if (!_.find(scope.items, {
              'selected': true
            })) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      };
    },
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      isConfirmClicked: '='
    }
  };
})

.directive('multipleMatrix3x3', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/matrix3x3.tpl.html',
    link: function(scope) {
      scope.selectAnswer = function(index, mGroup) {
        if (!scope.isConfirmClicked) {
          var answer = scope.items[index],
          answerId = answer.id,
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction'),
          currentSection = _.filter(scope.items, function(answer) {
            return answer.matrix_group == mGroup
          }),
          trueSelected = _.filter(currentSection, {
            'selected': true
          });

          if (trueSelected) {
            _.forEach(currentSection, function(answer) {
              if (answerId != answer.id) answer.selected = false;
            });
          }

          if (!answer.selected) {
            answer.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            answer.selected = false;
            if (!_.find(scope.items, {
              'selected': true
            })) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      };
    },
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      isConfirmClicked: '='
    }
  };
})

.directive('twoChoice', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/twoChoice.tpl.html',
    link: function(scope) {
      scope.maxOpt = [];
      scope.selectAnswer = function(index) {
        if (!scope.isConfirmClicked) {
          var answer = scope.items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');
          if (!answer.selected) {
            /*validation which takes care to keep just 2 options selected*/
            if (scope.maxOpt.length >= 2) {
              var ansR = _.find(scope.items, {
                'id': scope.maxOpt[0]
              });
              ansR.selected = false;
              scope.maxOpt = _.filter(scope.maxOpt, function(num, i) {
                return i != 0
              });
            }
            scope.maxOpt.push(answer.id);
            answer.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            scope.maxOpt = _.filter(scope.maxOpt, function(num) {
              return num != answer.id
            });
            answer.selected = false;
            if (!_.find(scope.items, {
              'selected': true
            })) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      };
    },
    scope: {
      maxOpt: '=',
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      isConfirmClicked: '='
    }
  };
})

.directive('provisionalSat', function() {

  function validateEntry(value) {
    if (angular.isUndefined(value) || value === '' || value === null) {
      return null;
    } else {
      return (angular.isDefined(value) && value != null);
    }
  }

  function handleValidation(isValid) {
    var nexAction = $('#nextAction'),
    seeAnswer = $('#skipAction');
    if (isValid) {
      nexAction.addClass('btn-primary');
      seeAnswer.addClass('hide');
    } else {
      nexAction.removeClass('btn-primary');
      seeAnswer.removeClass('hide');
    }
  }

  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/numericEntry.tpl.html',
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      portal: '=',
      answerStatus: '='
    },
    link: function(scope) {

      scope.$watch('portal.numerator', function(newVal, oldVal) {
        scope.isNumeratorValid = validateEntry(newVal);
        handleValidation(scope.isNumeratorValid);
      });

    }
  };
})

.directive('sat', function(questionTypesService) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/sat.tpl.html',
    link: function() {
      questionTypesService.satFactory();
    },
    scope: {}
  };
})

.directive('numericEntry', function(questionTypesService) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/numericEntry.tpl.html',
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      portal: '=',
      answerStatus: '='
    },

    link: function(scope) {
      questionTypesService.numericEntry(scope);
    }

  };
})

.directive('fractionEntry', function(questionTypesService) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/question-types/templates/fractionEntry.tpl.html',
    scope: {
      items: '=items',
      showExplanation: '=',
      hasExplanation: '&',
      portal: '=',
      answerStatus: '='

    },
    link: function(scope) {
      questionTypesService.fractionEntry(scope);
    }
  };
})


.directive('answerType', function($compile) {

  var fractionTpl = '<div fraction-entry answer-status="answerStatus" ' +
  'portal="portalC" items="items" show-explanation="showExplanation" ' +
  'has-explanation="answerHasExplanation(index)" >' +
  '</div>',

  matrix2x3Tpl = '<div multiple-matrix2x3 items="items" show-explanation="showExplanation"' +
  'has-explanation="answerHasExplanation(index)" is-confirm-clicked="isbuttonClicked"></div>',

  matrix3x3Tpl = ' <div multiple-matrix3x3 items="items" show-explanation="showExplanation" ' +
  'has-explanation="answerHasExplanation(index)" is-confirm-clicked="isbuttonClicked"></div>',

  multipleChoiceTpl = '<div multiple-choice items="items" show-explanation="showExplanation" '+
  'is-confirm-clicked="isbuttonClicked"></div>',

  numericEntryTpl = '<div numeric-entry answer-status="answerStatus" portal="portalC" items="items" ' +
  'show-explanation="showExplanation" has-explanation="answerHasExplanation(index)"></div>',

  provisionalSatTpl = '<div provisional-sat answer-status="answerStatus" portal="portalC" items="items" ' +
  'show-explanation="showExplanation" has-explanation="answerHasExplanation(index)"></div>',

  oneChoiceTpl = '<div one-choice items="items" show-explanation="showExplanation" ' +
  'has-explanation="answerHasExplanation(index)" is-confirm-clicked="isbuttonClicked"></div>',

  satTpl = ' <div sat></div>',

  twoChoiceTpl = '<div  two-choice items="items" max-opt="maxOpts" show-explanation="showExplanation" ' +
  'has-explanation="answerHasExplanation(index)" is-confirm-clicked="isbuttonClicked"></div>';

  var getAnswerTemplate = function(questionKind) {
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
      template = provisionalSatTpl;
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
  var linker = function(scope, element, attrs) {

    element.html(getAnswerTemplate(attrs.content)).show();
    $compile(element.contents())(scope);

    scope.$watch('lastAnswerLoaded', function(value) {

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
