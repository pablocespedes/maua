'use strict'
braintreeDropin = (braintreeFactory)->
  new class BraintreeDropin
    restrict: 'AE'
    template: '<div id="bt-dropin"></div>',
    scope:
      options: '='
    controller: ($scope, braintreeFactory) ->
      options = $scope.options or {}
      options.container = 'bt-dropin'

      braintreeFactory.setupDropin options

braintreeDropin.$inject = ['braintreeFactory']
module.exports = braintreeDropin
