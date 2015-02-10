config = ($authProvider,loginUrl,apiUrl)->

  $authProvider.loginUrl = loginUrl

  google = require('./google.auth')()
  facebook = require('./facebook.auth')()
  
  $authProvider.google(google)
  $authProvider.facebook(facebook)

config.$inject = ['$authProvider','loginUrl','apiUrl']

module.exports = config
