config = ($httpProvider, $stateProvider, $urlRouterProvider,RestangularProvider,httpProvider)->
  
  urlPattern = /http(s?)\:\/\/staging/.test(location.origin)
  localPattern = /http(s?)\:\/\/127.0.0.1:9000/.test(location.origin)
  url = (if urlPattern or localPattern then environmentCons.stagingAPI else environmentCons.liveAPI)

  delete $httpProvider.defaults.headers.common["X-Requested-With"]

  $httpProvider.defaults.headers.common["Content-Type"] = "application/json"
  $httpProvider.defaults.headers.common["Accept"] = "application/json, text/html, text/plain"
  RestangularProvider.setFullResponse true
  RestangularProvider.setBaseUrl url
  RestangularProvider.setDefaultRequestParams timeStamp: new Date().getTime()
  
  $stateProvider.state 'common',
  templateUrl: 'app/main.html'
  abstract: true
  
  $urlRouterProvider.otherwise('/register')
  
config
    .$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider','RestangularProvider','httpProvider']
module.exports = config
