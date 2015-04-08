'use strict'
whenScrolled = ()->
  new class WhenScrolled
    whenScrolled = ->
    (scope, elm, attr) ->
      raw = elm[0]
      elm.bind 'scroll', ->
        if raw.scrollTop + raw.offsetHeight + 2 >= raw.scrollHeight
          scope.$apply attr.whenScrolled

module.exports = whenScrolled
