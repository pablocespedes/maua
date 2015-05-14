'use strict'
### @ngInject ###
alert = (,$mdToast) ->
  new class Alert
    constructor: () ->
    sendError: (errroMessage) ->
     $mdToast.show $mdToast.simple()
     .content(errroMessage)
     .position($scope.getToastPosition())
     .hideDelay(3000)



alert.$inject = ['$mdToast']
module.exports = alert
