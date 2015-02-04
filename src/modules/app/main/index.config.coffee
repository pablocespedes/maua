config = ($httpProvider, $stateProvider, $urlRouterProvider,
          RestangularProvider,apiUrl)->

  delete $httpProvider.defaults.headers.common["X-Requested-With"]

  RestangularProvider.setBaseUrl apiUrl
  RestangularProvider.setDefaultRequestParams timeStamp: new Date().getTime()

  $stateProvider.state 'common',
  templateUrl: 'app/main/main.html'
  abstract: true

  $urlRouterProvider.otherwise('/login')
  $httpProvider.interceptors.push 'authInterceptor'

config
    .$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider',
                'RestangularProvider','apiUrl']
module.exports = config
