authInterceptor = (authorization) ->
  new class AuthInterceptor
    constructor: ->

    request: (config) ->
      if typeof config.data isnt 'undefined'
        token = authorization.getToken()
        config.headers.Authorization = "Bearer " + token  if token
      config
    response: (response)->
      response
authInterceptor.$inject = ['authorization']
module.exports = authInterceptor