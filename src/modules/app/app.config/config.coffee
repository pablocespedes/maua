'use strict'

initConfig =  ($httpProvider, $stateProvider,
  $urlRouterProvider,RestangularProvider, ApiUrlsProvider,$mdThemingProvider) ->
  $mdThemingProvider
  .theme('default')
  .primaryPalette('cyan',
  'default': '700'
  'hue-1': '400'
  'hue-2': '800'
  'hue-3': 'A700')
  .accentPalette 'blue-grey', 'default': '100'

  ApiUrlsProvider.host = "api.grockit.com"
  ApiUrlsProvider.port = ''#3000

  delete $httpProvider.defaults.headers.common["X-Requested-With"]

  $httpProvider.defaults.headers.common["Content-Type"] = 'application/json'
  $httpProvider.defaults.headers.common["Accept"] =
  'application/json, text/html, text/plain'

  RestangularProvider.setFullResponse true
  RestangularProvider.setBaseUrl ApiUrlsProvider.baseUrl()
  RestangularProvider.setDefaultRequestParams
  timeStamp: new Date().getTime()

  $stateProvider.state 'common',
  templateUrl: 'app/main/main.html'
  abstract: true
  controller: 'AppController'
  controllerAs: 'appCtrl'

  $urlRouterProvider.otherwise('/login')
  $httpProvider.interceptors.push 'authInterceptor'

initConfig.$inject = ['$httpProvider','$stateProvider',
'$urlRouterProvider', 'RestangularProvider','ApiUrlsProvider',
'$mdThemingProvider']


module.exports = initConfig