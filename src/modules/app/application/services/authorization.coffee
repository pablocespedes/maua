authorization = ($window,storage)->
  new class Authorization

    ##cached token allow us to have the token in memory, just as
    ##little optimization to not access the token that is save on local storage.
    constructor: ($window)->
      console.log storage
      @cachedToken = undefined
      @cachedUser = undefined
      @userInfo = "userInfo"
      @userToken = "userToken"
      @paymentBannerInfo = 'paymentBanner'
      @questionTimingInfo = 'questionTiming'

    existy:(x)->
      return x != null and x != 'null' and x != undefined and x != 'undefined'

    setToken: (token) ->
      @cachedToken = token
      storage.save @userToken, token

    getToken: ->
      @cachedToken = storage.getCookie 'authentication_token'
      @cachedToken

    removeCookie :->
      #delete $cookies['authentication_token']
      storage.removeCookie 'authentication_token'

    removeToken: ->
      @cachedToken = null
      storage.remove @userToken

    setUser: (userData)->
      @cachedUser = userData
      storage.save @userInfo, userData

    getUser: ->
      @cachedUser = storage.get(@userInfo) unless @cachedUser
      @cachedUser

    userExist: ->
      @existy(@getUser())

    tokenExists: ->
      @existy(@getToken())

    removeUser: ->
      @cachedUser = null
      storage.remove @userInfo
      storage.remove @paymentBannerInfo
      storage.remove @questionTimingInfo

authorization.$inject = ['$window','storage']
module.exports = authorization