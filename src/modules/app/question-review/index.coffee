'use strict'
ReviewController = require('./question.review.controller')
ReviewService = require('./services/review.services')
module.exports = angular.module('grockitApp.questionReview', [])
    .config(($stateProvider) ->
      $stateProvider.state 'review',
      url: '/:subject/review/:rounSessionId'
      parent: 'common'
      templateUrl: 'app/question-review/question-review.html'
      controller: 'ReviewController'
      controllerAs: 'vmPr'
)
.factory 'reviewService', ReviewService
.controller 'ReviewController', ReviewController
