'use strict'

### @ngInject ###
class Alert
  @inject: ['$rootScope','$timeout']
  constructor: (@$http,@$timeout) ->
    @alertTimeout
  (type, title, message, timeout) ->
    $rootScope.alert={
      hasBeenShown:true,
      show:true,
      type:type,
      message:message,
      title:title
    }
    $timeout.cancel(alertTimeout)
    @alertTimeout = $timeout (-> $rootScope.alert.show = false), timeout || 2000
module.exports = Alert

