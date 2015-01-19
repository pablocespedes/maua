'use strict'
class AuthInterceptor
    
  constructor: (authToken)->
    @authToken=authToken
    console.log('hey: '+@authToken)
  request: (config) ->
    if typeof config.data isnt 'undefined'
      token = @authToken.getToken()
      config.headers.Authorization = "Bearer " + token  if token
    config
  response: (response)->
    response
    
module.exports = (authToken)-> new AuthInterceptor(authToken)
