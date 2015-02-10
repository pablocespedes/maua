
'use strict'
### @ngInject ###
class DashboardController
  # Services injected into the controller constructor
  constructor: (@alert) ->


DashboardController.$inject = ['alert']

module.exports = DashboardController
