Storage =require('./_storage')

authorization = ($window,$cookies)->
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

    getCookie: (key) ->
      cookie = null
      keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
      if angular.isDefined(keyValue) and keyValue != null
        cookie = keyValue[2]
      cookie

    getToken: ->
      @cachedToken = decodeURIComponent @getCookie('authentication_token')
      #@get(@userToken) unless @cachedToken
      @cachedToken

    removeCookie :->
      delete $cookies['authentication_token']

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

    tokenExists: ->
      !!(@getToken())

    removeUser: ->
      @cachedUser = null
      @remove @userInfo

authorization.$inject = ['$window','$cookies']
module.exports = authorization