'use strict'
alert = ($mdToast) ->
  new class Alert
    constructor: () ->
    success: (message) ->
      toast = $mdToast.simple()
      .content(message)
      .action('Ok').highlightAction(false)
      .position('top right')

      return $mdToast.show(toast)

alert.$inject = ['$mdToast']
module.exports = alert
