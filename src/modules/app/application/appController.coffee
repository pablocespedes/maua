'use strict'

### @ngInject ###

class AppController
  @inject: ['$scope','alert']
  
  constructor: ($scope,@alert)->
  

module.exports = AppController