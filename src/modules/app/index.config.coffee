config = ($httpProvider, $stateProvider, $urlRouterProvider)->
  
  $stateProvider.state 'common',
  url: ''
  templateUrl: 'app/main.html'
  abstract: true
  
  $urlRouterProvider.otherwise('/login')
  
config
    .$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider']
module.exports = config
