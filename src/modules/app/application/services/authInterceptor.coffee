authInterceptor = ($window,$q,authorization) ->
  new class AuthInterceptor
    constructor: ->
      @addstartsWith()

    addstartsWith: ->
      if typeof String::startsWith isnt 'function'
        String::startsWith = (str) ->
          @indexOf(str) == 0

    request: (config) ->
      shouldAddToken = config.url.startsWith 'https://api' or
       config.url.startsWith 'https://staging'

      console.log config
      if shouldAddToken
        accestoken = authorization.getToken()

        if(accestoken isnt 'null')
          config.headers.Authorization = 'Token token='+'"'+accestoken+'=="'
              # config.headers.Authorization = 'Token token='+
              #  'dXNlcl9pZD1lZmE0MGVlMC1iMzk5LTAxMzEtZWI5Y'+
              # 'S0yMjAwMGExZjkxZDc="'
              #config.headers.Authorization = "Bearer " + token  if token
      config
    responseError: (rejection) ->
      console.log rejection
      if rejection.status == 401
        $window.location.href ='https://staging.grockit.com/logout'


        ### If not a 401, do nothing with this error.
        # This is necessary to make a `responseError`
        # interceptor a no-op.
        ###

      $q.reject rejection
    response: (response)->
      response
authInterceptor.$inject = ['$window','$q','authorization']
module.exports = authInterceptor