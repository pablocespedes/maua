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
      timerSetting.minutes = newtime
      @saveTime timerSetting

    resetTime:(questionCheck,timerSetting)->
      console.log questionCheck,timerSetting
      if !questionCheck
        timerSetting.minutes = 0
        @saveTime(timerSetting)

module.exports = questionTiming
