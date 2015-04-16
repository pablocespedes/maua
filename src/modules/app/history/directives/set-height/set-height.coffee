'use strict'
setHeight = ($window)->
  new class SetHeight
    restrict: 'AE'
    link: (scope, element, attrs) ->
      w = angular.element($window)
      scope.getHeight = ->
        w.height() - 200+ 'px'
      scope.setHeight = ->
        #element[0].style['height']= scope.getHeight()
        element.attr 'style', 'height:' + scope.getHeight()
        return
      scope.setHeight()
      w.bind 'resize', ->
        scope.setHeight()
        scope.$apply()

setHeight.$inject = ['$window']
module.exports = setHeight
