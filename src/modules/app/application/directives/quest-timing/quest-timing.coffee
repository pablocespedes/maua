'use strict'
questionTiming = ()->
  new class QuestionTiming
    constructor: () ->
    restrict: 'AE'
    replace: true
    templateUrl: 'app/application/directives/quest-timing/quest-timing.html'
    scope:
      data: '='
      yourTime: '='
      answerStatus: '='
      percentAnswered: '='
      confirmed: '='
      xpTag: '='
      lastAnswerLoaded: '='
    link: (scope, element, attrs) ->
      scope.showPercAnswered = !(scope.lastAnswerLoaded == 'NumericEntry' or
       scope.lastAnswerLoaded == 'NumericEntryFraction')
      if scope.data != undefined
        if scope.data.avg_time_to_answer >= 1 and
        scope.data.total_answered > 100
          scope.compAvgStatus = scope.yourTime -
          scope.data.avg_time_to_answer > 0
          if scope.compAvgStatus
            scope.compAvg = scope.yourTime - scope.data.avg_time_to_answer
          else
            scope.compAvg = -(scope.yourTime - scope.data.avg_time_to_answer)
        return


module.exports = questionTiming