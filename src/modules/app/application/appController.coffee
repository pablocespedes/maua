'use strict'

### @ngInject ###

class AppController
  @inject: ['$scope','alert']
  
  constructor: ($scope,@alert)->
  
  list: [
    text: "learn coffescript"
    done: false
  ,
    text: "learn angular"
    done: true
  ]

  addTodo: ->
    @list.push
      text: @input
      done: false
    @input = ''

module.exports = AppController