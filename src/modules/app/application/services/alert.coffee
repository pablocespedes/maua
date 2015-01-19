'use strict'

### @ngInject ###
alert = ($rootScope, $timeout) ->
  alertTimeout = undefined
  (type, title, message, timeout) ->
    $rootScope.alert =
      hasBeenShown: true
      show: true
      type: type
      message: message
      title: title
    $timeout.cancel alertTimeout
    alertTimeout = $timeout(->
      $rootScope.alert.show = false
      return
    , timeout or 2000)
module.exports = alert
