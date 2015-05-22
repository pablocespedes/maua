module.exports = angular.module('grockitApp.questionofday', [])
    .config ($stateProvider) ->
      $stateProvider.state 'question-of-day',
        url: '/:subject/question-of-day'
        #parent: 'common'
        templateUrl: 'app/question-of-day/question-of-day.html'
        controller: 'QuestionDayController'
        controllerAs: 'vmPr'
.controller 'QuestionDayController', require('./question-of-day.controller')
