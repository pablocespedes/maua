CollectionService =require('./collection')
timer = ($interval,utilities)->
  new class Timer extends CollectionService
    constructor: ->
      super()
    createTimer : ->
      timer =
        seconds: 0
        interval: null
        start:(count) ->
          if not utilities.truthy(count)
            count = 0
          @interval = $interval((->
            timer.seconds++
            return
          ), 1000, count)
        pause: ->
          $interval.cancel @interval
        reset: ->
          @seconds = 0
          @pause()
      timer
    create : ->
      timer = @createTimer()
      @add timer
      timer

    destroy : (timer) ->
      $interval.cancel timer.interval
      @remove timer

timer.$inject = ['$interval','utilities']
module.exports = timer
