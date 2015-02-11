'use strict'

initConfig =  ($httpProvider, $stateProvider,
  $urlRouterProvider, RestangularProvider, ApiUrlsProvider) ->

  ApiUrlsProvider.host = "localhost"
  ApiUrlsProvider.port = 3000

  delete $httpProvider.defaults.headers.common["X-Requested-With"]

  RestangularProvider.setBaseUrl ApiUrlsProvider.baseUrl()
  RestangularProvider.setDefaultRequestParams
  timeStamp: new Date().getTime()

  $stateProvider.state 'common',
  templateUrl: 'app/main/main.html'
  abstract: true

  $urlRouterProvider.otherwise('/login')
  $httpProvider.interceptors.push 'authInterceptor'

initConfig.$inject = ['$httpProvider','$stateProvider',
  '$urlRouterProvider','RestangularProvider','ApiUrlsProvider']

module.exports = initConfig