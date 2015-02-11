Storage =require('./_storage')

authorization = ($window)->
  new class Authorization extends Storage

    ##cached token allow us to have the token in memory, just as
    ##little optimization to not access the token that is save on local storage.
    constructor: ($window)->
      super()
      @cachedToken = undefined
      @cachedUser = undefined
      @userInfo = "userInfo"
      @userToken = "userToken"

    setToken: (token) ->
      @cachedToken = token
      @save @userToken, token

    getToken: ->
      @cachedToken = @get(@userToken) unless @cachedToken
      @cachedToken
    removeToken: ->
      @cachedToken = null
      @remove @userToken

    setUser: (userData)->
      @cachedUser = userData
      @save @userInfo, userData

    getUser: ->
      @cachedUser = @get(@userInfo) unless @cachedUser
      @cachedUser

    userExist: ->
      !!(@getUser())

    removeUser: ->
      @cachedUser = null
      @remove @userInfo

authorization.$inject = ['$window']
module.exports = authorization