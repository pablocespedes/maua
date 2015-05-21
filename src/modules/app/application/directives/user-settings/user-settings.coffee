'use strict'
userSettings = (questionTiming,utilities)->
  new class UserSettings
    constructor: () ->
    restrict: 'AE'
    replace: true
    templateUrl: 'app/application/directives/user-settings/user-settings.html'
    link: (scope, element, attrs, ctrl) ->
      scope.timerSetting =
        minutes: 0

      scope.showUtc =  if utilities.lastUrlWord() is 'dashboard' or
          utilities.lastUrlWord() is 'custom-practice' then true

      scope.openSetting = false

      time = questionTiming.getTime()

      if utilities.existy(time)
        scope.timerSetting.minutes = time.minutes

      scope.questionCheck =
        if utilities.existy(time) and time.minutes > 0  then true else false

      scope.onChange = (timeStatus)->
        questionTiming.resetTime(timeStatus,scope.timerSetting)

      scope.$watch 'timerSetting.minutes', (val)->
        questionTiming.updateTime(scope.questionCheck,scope.timerSetting,val)

userSettings.$inject = ['questionTiming','utilities']
module.exports = userSettings