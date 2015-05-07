'use strict'

module.exports = angular.module('grockitApp.question', [])
    .config ($stateProvider) ->
      $stateProvider.state 'question',
      url: '/question/{questionId}'
      parent: 'common'
      templateUrl: 'app/question-view/question.html'
      controller: 'QuestionController'
      controllerAs: 'vmPr'
.controller 'QuestionController', require('./question.controller')
