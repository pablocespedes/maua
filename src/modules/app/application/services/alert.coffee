'use strict'
alert = ($mdToast) ->
  new class Alert
    constructor: () ->
    withAction: (message, action) ->
      toast = $mdToast.simple()
      .content(message)
      .action(action).highlightAction(false)
      .position('top right')

      return $mdToast.show(toast)

    simple: (message, action) ->
      $mdToast.show $mdToast.simple()
      .content(errroMessage)
      .position('top right')
      .hideDelay(3000)



alert.$inject = ['$mdToast']
module.exports = alert
