authInterceptor = (authorization) ->
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

      if shouldAddToken
        accestoken = authorization.getToken()

        if(accestoken isnt 'null')
          config.headers.Authorization = 'Token token='+'"'+accestoken+'=="'
              # config.headers.Authorization = 'Token token='+
              #  'dXNlcl9pZD1lZmE0MGVlMC1iMzk5LTAxMzEtZWI5Y'+
              # 'S0yMjAwMGExZjkxZDc="'
              #config.headers.Authorization = "Bearer " + token  if token
      config
    response: (response)->
      response
authInterceptor.$inject = ['authorization']
module.exports = authInterceptor