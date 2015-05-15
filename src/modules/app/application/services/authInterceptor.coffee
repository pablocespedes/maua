authInterceptor = ($window,$q,authorization,$injector) ->
  new class AuthInterceptor
    constructor: ->
      @addstartsWith()

    errorHandler:->
      $injector.get 'errorHandler'

    utilities:->
      $injector.get 'utilities'

    addstartsWith: ->
      if typeof String::startsWith isnt 'function'
        String::startsWith = (str) ->
          @indexOf(str) == 0

    request: (config) ->
      shouldAddToken = config.url.startsWith 'https://api' or
       config.url.startsWith 'https://staging'

      if shouldAddToken
        accestoken = authorization.getToken()

        if(accestoken isnt 'null')
          config.headers.Authorization = 'Token token='+'"'+accestoken+'=="'

      config
    responseError: (rejection) ->
      console.log rejection, 'rejection'
      if rejection.status == 401
        $window.location.href ='https://staging.grockit.com/logout'

      errorHandler().validateErrorType(rejection)
      $q.reject rejection

    response: (response)->
      response
authInterceptor.$inject = ['$window','$q','authorization','$injector']
module.exports = authInterceptor