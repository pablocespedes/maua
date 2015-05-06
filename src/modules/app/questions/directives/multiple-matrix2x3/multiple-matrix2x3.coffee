'use strict'
multipleMatrix2x3 = (questionTypeService)->
  new class Matrix2x3
    constructor: () ->
    ## Constructor stuff
    restrict: 'AE'
    replace: true
    templateUrl: 'app/questions/directives/templates/matrix2x3.tpl.html',
    scope:
      items: '=items'
      showExplanation: '='
      isConfirmClicked: '='
    link: (scope, element, attrs, controller) ->
      scope.showforCurrentGroup = true

      scope.crossOutChoice = (index, event,subitem) ->
        questionTypeService.crossOutChoice subitem, index, event
        return

      scope.selectAnswer = (index, mGroup, subitem) ->
        questionTypeService.selectMatrix scope.isConfirmClicked, subitem,
        index, mGroup
        return

multipleMatrix2x3.$inject = ['questionTypeService']
module.exports = multipleMatrix2x3
