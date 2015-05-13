'use strict'
userSettings = (questionTiming,utilities)->
  new class UserSettings
    constructor: () ->
    restrict: 'AE'
    replace: true
    templateUrl: 'app/application/directives/user-settings/user-settings.html'
    link: (scope, element, attrs) ->
      scope.timerSetting =
        minutes: 0

      scope.openSetting = false

      time = questionTiming.getTime()

      if utilities.existy(time)
        scope.timerSetting.minutes = time.minutes

      scope.questionCheck =
        if utilities.existy(time) then true else false

      scope.$watch 'timerSetting.minutes', (val)->
        questionTiming.updateTime(scope.questionCheck,scope.timerSetting,val)

      scope.$watch 'questionCheck', (val)->
        questionTiming.resetTime(val,scope.timerSetting)


userSettings.$inject = ['questionTiming','utilities']
module.exports = userSettings