'use strict'

initConfig =  ($httpProvider, $stateProvider,
  $urlRouterProvider,RestangularProvider, ApiUrlsProvider,$mdThemingProvider,
  intercomProvider, IntercomAppId) ->
  intercomProvider.appID(IntercomAppId)
  intercomProvider.asyncLoading(true)

  $mdThemingProvider
  .theme('default')
    .primaryPalette('blue-grey',
    'default': '500'
    'hue-1': '400'
    'hue-2': '800'
    'hue-3': '700')
    .accentPalette 'grey', 'default': '600'
  $mdThemingProvider
  .theme('kapTheme')
    .primaryPalette('indigo')

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

  #$urlRouterProvider.otherwise('/login')
  $httpProvider.interceptors.push 'authInterceptor'

initConfig.$inject = ['$httpProvider','$stateProvider',
'$urlRouterProvider', 'RestangularProvider','ApiUrlsProvider',
'$mdThemingProvider','intercomProvider', 'IntercomAppId']


module.exports = initConfig