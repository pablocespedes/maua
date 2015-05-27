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
      @paymentBannerInfo = 'paymentBanner'
      @questionTimingInfo = 'questionTiming'

    existy:(x)->
      return x != null and x != 'null' and x != undefined and x != 'undefined'

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
      @existy(@getUser())

    tokenExists: ->
      @existy(@getToken())

    removeUser: ->
      @cachedUser = null
      @remove @userInfo
      @remove @paymentBannerInfo
      @remove @questionTimingInfo

authorization.$inject = ['$window','$cookies']
module.exports = authorization