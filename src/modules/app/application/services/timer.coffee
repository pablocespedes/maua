CollectionService =require('./collection')
timer = ($interval)->
  new class Timer extends CollectionService
    constructor: ->
      super()
    createTimer : ->
      timer =
        seconds: 0
        interval: null
        start: ->
          @interval = $interval((=>
            @seconds++

          ), 1000)
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

timer.$inject = ['$interval']
module.exports = timer
