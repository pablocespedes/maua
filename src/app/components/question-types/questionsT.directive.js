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
        hasExplanation: '&',
        isConfirmClicked: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
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
        hasExplanation: '&',
        isConfirmClicked: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
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
        hasExplanation: '&',
        isConfirmClicked: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
      scope.selectAnswer = function(index, mGroup) {
        if (!scope.isConfirmClicked) {
          var answer = scope.items[index],
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction'),
          currentSection = _.filter(scope.items, function(answer) {
            return answer.matrix_group == mGroup
          }),
          trueSelected = _.filter(currentSection, {
            'selected': true
          });

          if (trueSelected) {
            _.forEach(currentSection, function(ansResult) {
              if (answer.id != ansResult.id) ansResult.selected = false;
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
        hasExplanation: '&',
        isConfirmClicked: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
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
        hasExplanation: '&',
        isConfirmClicked: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
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
        hasExplanation: '&',
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
        hasExplanation: '&',
        portal: '=',
        answerStatus: '='
      },
      controller: EntriesController
    };
    return directive;

    function link(scope, element, attrs, controller) {

      scope.$watch('portal.numerator', function(newVal, oldVal) {
        scope.isNumeratorValid = controller.validateNumber(newVal);
         scope.portal.isDisabled = scope.isNumeratorValid===null ? scope.isNumeratorValid : !scope.isNumeratorValid;
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
        hasExplanation: '&',
        portal: '=',
        answerStatus: '='

      },
      controller: EntriesController
    };
    return directive;

    function link(scope, element, attrs, controller) {

      scope.$watch('portal.numerator', function(newVal, oldVal) {
        scope.isNumeratorValid = controller.validateNumber(newVal);
        scope.portal.isDisabled = scope.isNumeratorValid===null ? scope.isNumeratorValid : !scope.isNumeratorValid;
        controller.handleValidation(scope.isNumeratorValid && scope.isDenominatorValid);
      });
      scope.$watch('portal.denominator', function(newVal, oldVal) {
        scope.isDenominatorValid = controller.validateNumber(newVal);
        scope.portal.isDisabled = scope.isNumeratorValid===null ? scope.isNumeratorValid : !scope.isNumeratorValid;
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

})();
