'use strict'

### @ngInject ###
class DashboardController

  # Services injected into the controller constructor
  @inject: ['$scope', '$log']
 
  constructor: ($scope, $log) ->
    # Set up scope with a property and method
    $scope.prop = 'foo'
    $scope.method = -> $log.info 'scope method!'
 
    # Set up controller with a property
    @log = $log   # Store log service for later
 
  # Methods are available in views using the "Ctrl as foo" ng-controller syntax.
  method: -> @log.info 'controller method!'
 
module.exports = DashboardController