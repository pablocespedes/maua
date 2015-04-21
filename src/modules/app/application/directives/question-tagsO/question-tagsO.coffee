'use strict'
questionTagsOnly = ()->
  new class QuestionTagsOnly
    constructor: () ->
    restrict: 'AE'
    templateUrl: 'app/application/directives/question-tagsO/question-tagsO.html'
    scope:
      tags: '='

module.exports = questionTagsOnly