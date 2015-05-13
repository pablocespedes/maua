Storage =require('./_storage')

questionTiming = ->
  new class QuestionTiming extends Storage
    constructor: ->
      super()

    saveTime:(questionTime)->
      @save('questionTiming',questionTime)

    getTime:->
      @get('questionTiming')

    updateTime:(questionCheck,timerSetting, newtime)->
      if !questionCheck
        timerSetting.minutes = 0
      else
        timerSetting.minutes = newtime
      @saveTime timerSetting

    resetTime:(questionCheck,timerSetting)->
      if !questionCheck
        timerSetting.minutes = 0


module.exports = questionTiming
