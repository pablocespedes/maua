config = ($httpProvider, $stateProvider, $urlRouterProvider,
          RestangularProvider)->
  
  delete $httpProvider.defaults.headers.common["X-Requested-With"]

  RestangularProvider.setBaseUrl 'http://localhost:3000/'
  RestangularProvider.setDefaultRequestParams timeStamp: new Date().getTime()
  
  $stateProvider.state 'common',
  templateUrl: 'app/main.html'
  abstract: true
  
  $urlRouterProvider.otherwise('/register')
  $httpProvider.interceptors.push 'authInterceptor'

config
    .$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider',
                'RestangularProvider']
module.exports = config
