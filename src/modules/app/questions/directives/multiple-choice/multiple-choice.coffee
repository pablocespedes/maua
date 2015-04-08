'use strict'
multipleChoice = (questionTypeService)->
  new class MultipleChoice
    constructor: () ->
    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/multipleChoice.tpl.html',
    scope:
      items: '=items'
      showExplanation: '='
      isConfirmClicked: '='
    link: (scope, element, attrs) ->
      scope.showforCurrentGroup = true

      scope.crossOutChoice = (index, event) ->
        questionTypeService.crossOutChoice scope.items, index, event
        return

      scope.selectAnswer = (index) ->
        questionTypeService.selectMultipleChoice scope.isConfirmClicked,
        scope.items, index
        return

multipleChoice.$inject = ['questionTypeService']
module.exports = multipleChoice