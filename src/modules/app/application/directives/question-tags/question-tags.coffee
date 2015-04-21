'use strict'
questionTags= ()->
  new class QuestionTags
    constructor: () ->
    restrict: 'AE'
    replace: true
    templateUrl: 'app/application/directives/question-tags/question-tags.html'
    scope:
      tags: '='

module.exports = questionTags