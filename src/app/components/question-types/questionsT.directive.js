(function() {
  'use strict';
  angular
    .module('grockitApp.components')
    .directive('oneChoice', oneChoice)
    .directive('multipleChoice', multipleChoice)
    .directive('multipleMatrix2x3', multipleMatrix2x3)
    .directive('multipleMatrix3x3', multipleMatrix3x3)
    .directive('twoChoice', twoChoice)
    .directive('provisionalSat', provisionalSat)
    .directive('sat', sat)
    .directive('numericEntry', numericEntry)
    .directive('fractionEntry', fractionEntry)
    .controller('EntriesController', EntriesController);

  sat.$inject = ['questionTypesService'];
  EntriesController.$inject = ['$scope'];

  function oneChoice() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/oneChoice.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        totalAnswered: '=',
        isConfirmClicked: '=',
        groupId: '@'
      },
      controller: QuestionTypeController
    };
    return directive;

    function link(scope, element, attrs, controller) {
      scope.showforCurrentGroup = true; //(scope.groupId === 'act' || scope.groupId === 'sat' || scope.groupId === 'lsat');

      scope.crossOutChoice = function(index, event) {
        controller.crossOutChoice(scope.items, index, event);
      }

      scope.selectAnswer = function(index) {
        controller.selectOneChoice(scope.isConfirmClicked, scope.items, index);
      };
    }
  }

  function multipleChoice() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/multipleChoice.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        isConfirmClicked: '='
      },
      controller: QuestionTypeController
    };
    return directive;

    function link(scope, element, attrs, controller) {
      scope.showforCurrentGroup = true; //(scope.groupId === 'act' || scope.groupId === 'sat' || scope.groupId === 'lsat');

      scope.crossOutChoice = function(index, event) {
        controller.crossOutChoice(scope.items, index, event);
      }

      scope.selectAnswer = function(index) {
        controller.selectMultipleChoice(scope.isConfirmClicked, scope.items, index);
      };
    }
  }

  function multipleMatrix2x3() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/matrix2x3.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        isConfirmClicked: '='
      },
      controller: QuestionTypeController
    };
    return directive;

    function link(scope, element, attrs, controller) {
      scope.showforCurrentGroup = true; //(scope.groupId === 'act' || scope.groupId === 'sat' || scope.groupId === 'lsat');

      scope.crossOutChoice = function(index, event) {
        controller.crossOutChoice(scope.items, index, event);
      }
      scope.selectAnswer = function(index, mGroup) {
        controller.selectMatrix(scope.isConfirmClicked, scope.items, index, mGroup);
      };
    }
  }

  function multipleMatrix3x3() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/matrix3x3.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        isConfirmClicked: '='
      },
      controller: QuestionTypeController
    };
    return directive;

    function link(scope, element, attrs, controller) {
      scope.showforCurrentGroup = true; //(scope.groupId === 'act' || scope.groupId === 'sat' || scope.groupId === 'lsat');

      scope.crossOutChoice = function(index, event) {
        controller.crossOutChoice(scope.items, index, event);
      }

      scope.selectAnswer = function(index, mGroup) {
        controller.selectMatrix(scope.isConfirmClicked, scope.items, index, mGroup);
      };
    }
  }

  function twoChoice() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/twoChoice.tpl.html',
      restrict: 'A',
      scope: {
        maxOpt: '=',
        items: '=items',
        showExplanation: '=',
        isConfirmClicked: '='
      },
      controller: QuestionTypeController
    };
    return directive;

    function link(scope, element, attrs, controller) {
      scope.maxOpt = [];
      scope.showforCurrentGroup = true; //(scope.groupId === 'act' || scope.groupId === 'sat' || scope.groupId === 'lsat');

      scope.crossOutChoice = function(index, event) {
        controller.crossOutChoice(scope.items, index, event);
      }

      scope.selectAnswer = function(index) {
        controller.selectTwoChoice(scope.isConfirmClicked, scope.items, index, scope.maxOpt);
      };
    }
  }

  function provisionalSat() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/numericEntry.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        portal: '=',
        answerStatus: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch('portal.numerator', function(newVal, oldVal) {
        scope.isNumeratorValid = validateEntry(newVal);
        handleValidation(scope.isNumeratorValid);
      });
    }

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
  }

  function sat() {

    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/sat.tpl.html',
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var content = $('#parent');
      content.on('click', '#sat .column-matrix', function(e) {
        if (e.handled !== true) {
          var choice = $(e.target),
            choiceVal = choice.text(),
            selectedGroup = $(e.target).parents('td').data('group'),
            groups = $(e.target).parents('.choice').find('[data-group=' + selectedGroup + ']'),
            hasPrimary = choice.hasClass('btn-primary'),
            nexAction = $('#nextAction'),
            seeAnswer = $('#skipAction');

          groups.find('[type=button]').removeClass('btn-primary');
          groups.find('[type=button]').addClass('btn-outline');
          if (!hasPrimary) {
            choice.removeClass('btn-outline');
            choice.addClass('btn-primary');
            $('#input' + selectedGroup).text(choiceVal);
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            $('#input' + selectedGroup).text('');
            choice.removeClass('btn-primary');
            choice.addClass('btn-outline');
          }
        }
        e.handled = true;
      });
    }
  }

  function numericEntry() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/numericEntry.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        portal: '=',
        answerStatus: '='
      },
      controller: EntriesController
    };
    return directive;

    function link(scope, element, attrs, controller) {

      scope.$watch('portal.numerator', function(newVal, oldVal) {
        scope.isNumeratorValid = controller.validateNumber(newVal);
        scope.portal.isDisabled = scope.isNumeratorValid === null ? scope.isNumeratorValid : !scope.isNumeratorValid;
        controller.handleValidation(scope.isNumeratorValid);
      });


    }
  }

  function fractionEntry() {
    var directive = {
      link: link,
      templateUrl: 'app/components/question-types/templates/fractionEntry.tpl.html',
      restrict: 'A',
      scope: {
        items: '=items',
        showExplanation: '=',
        portal: '=',
        answerStatus: '=',
        isConfirmClicked: '='

      },
      controller: EntriesController
    };
    return directive;

    function link(scope, element, attrs, controller) {
      scope.status = function() {
        return (scope.isConfirmClicked && scope.answerStatus) ||
          (!scope.isConfirmClicked && (scope.isNumeratorValid && scope.isDenominatorValid))
      }

      scope.$watch('portal.numerator', function(newVal, oldVal) {
        scope.isNumeratorValid = controller.validateNumber(newVal);
        scope.portal.isDisabled = scope.isNumeratorValid == null && scope.isDenominatorValid == null ? false : !scope.isDenominatorValid || !scope.isNumeratorValid;
        controller.handleValidation(scope.isNumeratorValid && scope.isDenominatorValid);
      });
      scope.$watch('portal.denominator', function(newVal, oldVal) {
        scope.isDenominatorValid = controller.validateNumber(newVal);
        scope.portal.isDisabled = scope.isNumeratorValid == null && scope.isDenominatorValid == null ? false : !scope.isDenominatorValid || !scope.isNumeratorValid;
        controller.handleValidation(scope.isNumeratorValid && scope.isDenominatorValid);
      });
    }
  }

  function EntriesController($scope) {

    this.validateNumber = function(value) {
      if (angular.isUndefined(value) || value === '' || value === null) {
        return null;
      } else {
        value = value * 1;
        return (angular.isDefined(value) && value != null && !isNaN(value) && angular.isNumber(value));
      }
    }

    this.handleValidation = function(isValid) {
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
  }

  function QuestionTypeController() {

    function resetSelection(items, index) {
      return _.forEach(items, function(answer, i) {
        if (i === index)
          answer.selected = false;
      });
    }

    function findSelectedItems(items) {
      return _.find(items, {
        'selected': true
      });
    }

    this.selectOneChoice = function(isConfirmClicked, items, index) {
      if (!isConfirmClicked) {
        _.forEach(items, function(answer, i) {
          if (index != i) answer.selected = false;
        });

        var answer = items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');

        if (angular.isUndefined(answer.crossOut) || !(answer.crossOut)) {
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
      }
    }

    this.selectMultipleChoice = function(isConfirmClicked, items, index) {
      if (!isConfirmClicked) {
        var answers = items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');
        if (angular.isUndefined(answers.crossOut) || !(answers.crossOut)) {
          if (!answers.selected) {
            answers.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            answers.selected = false;
            if (!findSelectedItems(items)) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      }
    }

    this.selectMatrix = function(isConfirmClicked, items, index, mGroup) {
      if (!isConfirmClicked) {
        var answer = items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction'),
          currentSection = _.filter(items, function(answer) {
            return answer.matrix_group == mGroup
          }),
          trueSelected = findSelectedItems(currentSection);

        if (trueSelected) {
          _.forEach(currentSection, function(ansResult) {
            if (answer.id != ansResult.id) ansResult.selected = false;
          });
        }
        if (angular.isUndefined(answer.crossOut) || !(answer.crossOut)) {
          if (!answer.selected) {
            answer.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            answer.selected = false;
            if (!findSelectedItems(items)) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      }
    }

    this.selectTwoChoice = function(isConfirmClicked, items, index, maxOpt) {
      if (!isConfirmClicked) {
        var answer = items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');
        if (angular.isUndefined(answer.crossOut) || !(answer.crossOut)) {
          if (!answer.selected) {
            /*validation which takes care to keep just 2 options selected*/
            if (maxOpt.length >= 2) {
              var ansR = _.find(items, {
                'id': maxOpt[0]
              });
              ansR.selected = false;
              maxOpt = _.filter(maxOpt, function(num, i) {
                return i != 0
              });
            }
            maxOpt.push(answer.id);
            answer.selected = true;
            nexAction.addClass('btn-primary');
            seeAnswer.addClass('hide');
          } else {
            maxOpt = _.filter(maxOpt, function(num) {
              return num != answer.id
            });
            answer.selected = false;
            if (!_.find(items, {
                'selected': true
              })) {
              nexAction.removeClass('btn-primary');
              seeAnswer.removeClass('hide');
            }
          }
        }
      }
    }

    this.crossOutChoice = function(items, index, event) {
      var answer = items[index];
      var answerCrossOut = angular.isUndefined(answer.crossOut) || !(answer.crossOut) ? true : false;
      answer['crossOut'] = answerCrossOut;
      answer['crossOutMsg'] = answerCrossOut ? 'Include this option' : 'Remove this option';
      resetSelection(items, index);
      event.stopPropagation()
    }
  }
})();
