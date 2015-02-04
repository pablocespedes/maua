'use strict'

### @ngInject ###
class DashboardController

  # Services injected into the controller constructor
  @inject: ['$scope']

  constructor: ($scope) ->
    # Set up scope with a property and method
    $scope.prop = 'foo'


module.exports = DashboardController
