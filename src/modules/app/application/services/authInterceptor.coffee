module.exports = ['authToken',(authToken) ->
  new class AuthInterceptor

    constructor: () ->
            
    request: (config) ->
      if typeof config.data isnt 'undefined'
        token = authToken.getToken()
        config.headers.Authorization = "Bearer " + token  if token
      config
    response: (response)->
      response
]