scoreNotifier = (Observer)->
  new class ScoreNotifier
    constructor: ->
      @observableScore = Observer.create 'scorePrediction'

    setScore : (scorePredictionData) ->
      @observableScore.notify scorePredictionData

    observeScore: ->
      Observer.get 'scorePrediction'

scoreNotifier.$inject = ['Observer']
module.exports = scoreNotifier
