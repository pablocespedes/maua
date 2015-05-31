authInterceptor = ($window,$q,authorization,$injector) ->
  new class AuthInterceptor
    constructor: ->
      @addstartsWith()

    validateUrl = (config)->
      return config.url.startsWith 'https://api' or
      config.url.startsWith 'https://staging'

    errorHandler = ->
      $injector.get 'errorHandler'

    utilities= ->
      $injector.get 'utilities'

    addstartsWith: ->
      if typeof String::startsWith isnt 'function'
        String::startsWith = (str) ->
          @indexOf(str) == 0

    request: (config) ->

      if validateUrl(config)
        accestoken = authorization.getToken()

        if(accestoken isnt 'null')
          config.headers.Authorization = 'Token token='+'"'+accestoken+'=="'

      config

    responseError: (rejection) ->
      console.log validateUrl(rejection.config)
      if rejection.status == 401
        $window.location.href = utilities().originalGrockit+'/logout'

      if validateUrl(rejection.config)
        console.log 'entro'
        errorHandler().validateErrorType(rejection)
      $q.reject rejection

    response: (response)->
      response

authInterceptor.$inject = ['$window','$q','authorization','$injector']
module.exports = authInterceptor