config = ($authProvider,apiUrl)->

  $authProvider.loginUrl = apiUrl+'login'

  $authProvider.google(require('./google.auth'))
  $authProvider.facebook(require('./facebook.auth'))

config.$inject = ['$authProvider','apiUrl']
module.exports = config
