'use strict'

module.exports = () ->
  new class Config
    constructor: () ->
      
    baseUrl : 'http://localhost:3000/'
    initConfig: ($httpProvider, $stateProvider,
      $urlRouterProvider, RestangularProvider,apiUrl)->

      delete $httpProvider.defaults.headers.common["X-Requested-With"]

      RestangularProvider.setBaseUrl apiUrl
      RestangularProvider.setDefaultRequestParams
      timeStamp: new Date().getTime()

      $stateProvider.state 'common',
      templateUrl: 'app/main/main.html'
      abstract: true

      $urlRouterProvider.otherwise('/login')
      $httpProvider.interceptors.push 'authInterceptor'
    loginUrl : ->
      @baseUrl+'login'
    registerUrl: ->
      @baseUrl + 'register'

