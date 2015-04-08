'use strict'
setHeight = ($window)->
  new class SetHeight
    restrict: 'AE'
    scope:
      challenges: '='
    link: (scope, element, attrs) ->
      console.log element
      w = angular.element($window)
      scope.getHeight = ->
        w.height() - 200+ 'px'

      scope.setHeight = ->

        element[0].style['height']= scope.getHeight()
        #element.attrs 'style', 'height:' + scope.getHeight()

      scope.setHeight()
      w.bind 'resize', ->
        scope.setHeight()
        scope.$apply()

setHeight.$inject = ['$window']
module.exports = setHeight
