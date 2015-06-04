'use strict'
userProgress = ->
  new class UserProgress
    constructor: () ->
    restrict: 'AE'
    templateUrl: 'app/dashboard/directives/user-progress/user-progress.html'
    scope:
      progressInfo: '='

module.exports = userProgress