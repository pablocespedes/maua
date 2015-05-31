'use strict'
alert = ($mdToast,$mdDialog) ->
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

    customDialog: (options) ->
      confirm = $mdDialog.confirm()
      .title(options.title)
      .content(options.content)
      .ariaLabel(options.ariaLabel)
      .ok(options.okText)
      .cancel(options.cancelText)

      $mdDialog.show(confirm).then options.callbackSuccess,
      options.callbackError

    sendError: (message,action,callback)->
      @createAlert message,action, callback

alert.$inject = ['$mdToast','$mdDialog']
module.exports = alert
