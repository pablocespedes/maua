'use strict'

initConfig =  ($httpProvider, $stateProvider,
  $urlRouterProvider,RestangularProvider, ApiUrlsProvider,$mdThemingProvider,
  intercomProvider, IntercomAppId, urlsCons) ->
  intercomProvider.appID(IntercomAppId)
  intercomProvider.asyncLoading(true)
  console.log $mdThemingProvider
  $mdThemingProvider.definePalette 'grockitPalette',
    '50': 'b0d9e9' #light blue
    '100': 'ace0eb' #ligther blue
    '200': '3794be' #light cyan
    '300': '238399' #darker cyan
    '400': '6a4a3c' #brown
    '500': '404040' #dark grey
    '600': 'a20039' #dark Pink
    '700': '1d2172' #dark indigo
    '800': 'dc2730' # orange
    '900': 'f4a144' # amber
    'A100': '95bc55' # light lime
    'A200': '676767' #dark grey
    'A400': 'f0f0f0' # light grey
    'A700': 'dedede' #grey
    'contrastDefaultColor': 'light'

  $mdThemingProvider
  .theme('default')
    .primaryPalette('grockitPalette',
    'default': '300'
    'hue-1': '400'
    'hue-2': '200'
    'hue-3': '700')
    .accentPalette 'grey', 'default': '600'

  $mdThemingProvider
  .theme('kapTheme')
    .primaryPalette('indigo')

  urlPattern = /http(s?)\:\/\/staging/.test(location.origin)
  localPattern = /http(s?)\:\/\/localhost/.test(location.origin)

  host = if urlPattern or localPattern
  then urlsCons.stagingAPI else urlsCons.liveAPI

  ApiUrlsProvider.host = host
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
'$mdThemingProvider','intercomProvider', 'IntercomAppId','urlsCons']


module.exports = initConfig