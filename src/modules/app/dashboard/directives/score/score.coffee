'use strict'
scorePrediction = ->
  new class ScorePrediction
    constructor: () ->
    restrict: 'AE'
    templateUrl: 'app/dashboard/directives/score/score.html'
    scope:
      groupTitle: '='
      isVisible: '='
      noScoreMessage: '@'
      scoreData: '='

module.exports = scorePrediction