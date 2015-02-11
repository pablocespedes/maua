'use strict'

urls = (ApiUrlsProvider) ->
  ApiUrlsProvider.addUrls(
    login: '/login',
    register: '/register',
    google: "auth/google",
    facebook: "auth/facebook"
  )
urls.$inject = ['ApiUrlsProvider']
module.exports = urls


