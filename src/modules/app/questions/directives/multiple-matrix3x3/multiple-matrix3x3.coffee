'use strict'
multipleMatrix3x3 = (questionTypeService)->
  new class Matrix3x3
    constructor: () ->
    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/matrix3x3.tpl.html',
    scope:
      items: '=items'
      showExplanation: '='
      isConfirmClicked: '='
    link: (scope, element, attrs) ->
      scope.showforCurrentGroup = true

      scope.crossOutChoice = (index, event) ->
        questionTypeService.crossOutChoice scope.items, index, event
        return

      scope.selectAnswer = (index, mGroup) ->
        questionTypeService.selectMatrix scope.isConfirmClicked, scope.items,
         index, mGroup
        return

multipleMatrix3x3.$inject = ['questionTypeService']
module.exports = multipleMatrix3x3
