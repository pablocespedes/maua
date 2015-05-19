'use strict'
alert = ($mdToast) ->
  new class Alert
    constructor: ->
      @toast = $mdToast.simple()

    createAlert:(message,action,callback)->
      @toast
      .content(message)
      .action(action).highlightAction(false)
      .hideDelay(9000)
      .position('top right')
      if angular.isDefined callback
        $mdToast.show(@toast).then callback
      else
        $mdToast.show(@toast)

    success: (message, action) ->

    sendError: (message,action,callback)->
      @createAlert message,action, callback

alert.$inject = ['$mdToast']
module.exports = alert
