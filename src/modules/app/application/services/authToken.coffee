class AuthToken
    
    ##cached token allow us to have the token in memory, just as
    ##little optimization to not access the token that is save on local storage.
  constructor: ($window)->
    console.log($window)
    @storage = $window.localStorage
    @cachedToken = undefined
    @userToken = "userToken"
    return
  setToken: (token) ->
    @cachedToken = token
    @storage.setItem @userToken, token
    return
  getToken: ->
    @cachedToken = @storage.getItem(@userToken)  unless @cachedToken
    @cachedToken
  isAuthenticated: ->
    @getToken()?
  removeToken: ->
    @cachedToken = null
    @storage.removeItem @userToken
    return

module.exports = ($window)-> new AuthToken($window)