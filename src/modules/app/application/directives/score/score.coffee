'use strict'
scorePrediction = (utilities)->
  new class ScorePrediction
    constructor: () ->
    restrict: 'AE'
    replace: true
    templateUrl: 'app/application/directives/score/score.html'
    scope:
      groupTitle: '='
      isVisible: '='
      noScoreMessage: '@'
      scoreData: '='
    link: (scope, element, attrs) ->
      console.log scope
      scope.hasScore = ->
        console.log 'directive', scope.scoreData
        if utilities.truthy(scope.scoreData)
          scope.scoreData.incomplete == false and
           scope.scoreData.totalScore != null and scope.scoreData.totalScore > 0

      scope.showScoreData = ()->
        console.log 'test'
        scope.showScore = !scope.showScore
      return

scorePrediction.$inject =['utilities']
module.exports = scorePrediction