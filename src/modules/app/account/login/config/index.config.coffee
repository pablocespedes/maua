config = ($authProvider,ApiUrlsProvider)->
  apiUrls = ApiUrlsProvider.$get()  #because can't access service instance here
  $authProvider.loginUrl = apiUrls.getUrl("login")

  google = require('./google.auth')(apiUrls.getUrl("google"))
  facebook = require('./facebook.auth')(apiUrls.getUrl("facebook"))

  $authProvider.google(google)
  $authProvider.facebook(facebook)

config.$inject = ['$authProvider','ApiUrlsProvider']

module.exports = config
