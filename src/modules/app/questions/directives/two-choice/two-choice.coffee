'use strict'
twoChoice = (questionTypeService)->
  new class TwoChoice
    constructor: () ->
    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/twoChoice.tpl.html',
    scope:
      maxOpt: '='
      items: '=items'
      showExplanation: '='
      isConfirmClicked: '='
    link: (scope, element, attrs) ->
      scope.maxOpt = []
      scope.showforCurrentGroup = true

      scope.crossOutChoice = (index, event) ->
        questionTypeService.crossOutChoice scope.items, index, event
        return

      scope.selectAnswer = (index) ->
        questionTypeService.selectTwoChoice scope.isConfirmClicked,
        scope.items, index, scope.maxOpt
        return

twoChoice.$inject = ['questionTypeService']
module.exports = twoChoice
