module.exports = angular.module('grockitApp.payments', [])
    .config($stateProvider) ->
      $stateProvider.state 'payments',
      url: '/{subject}/payments'
      templateUrl: 'app/payments/payments.html'
      controller: 'PaymentsController'
      controllerAs: 'vmPay'
      return
.factory 'braintreeFactory', require('./services/braintree.service')
.directive 'braintreeDropin',
require('./directives/braintree-dropin/braintree-dropin')
.controller 'PaymentsController', require('./payments.controller')
