'use strict'
oneChoice = (questionTypeService)->
  new class OneChoice
    constructor: () ->

    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/oneChoice.tpl.html',
    scope:
      items: '=items'
      showExplanation: '='
      totalAnswered: '='
      isConfirmClicked: '='
      groupId: '@'
    link: (scope, element, attrs) ->
      scope.selectedChoice = false
      scope.showforCurrentGroup = true

      scope.crossOutChoice = (index, event) ->
        questionTypeService.crossOutChoice scope.items, index, event
        return

      scope.selectAnswer = (index) ->
        questionTypeService.selectOneChoice scope.isConfirmClicked,
         scope.items, index, scope.selectedChoice
        return
oneChoice.$inject = ['questionTypeService']
module.exports = oneChoice
