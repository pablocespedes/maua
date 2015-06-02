questionTiming = (storage)->
  new class QuestionTiming
    constructor: ->

    saveTime:(questionTime)->
      storage.save('questionTiming',questionTime)

    getTime:->
      storage.get('questionTiming')

    updateTime:(questionCheck,timerSetting, newtime)->
      timerSetting.minutes = newtime
      @saveTime timerSetting

    resetTime:(questionCheck,timerSetting)->
      if !questionCheck
        timerSetting.minutes = 0
        @saveTime(timerSetting)

questionTiming.$inject = ['storage']
module.exports = questionTiming
