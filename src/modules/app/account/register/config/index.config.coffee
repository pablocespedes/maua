config = ($authProvider)->

  $authProvider.loginUrl = 'register'

config.$inject = ['$authProvider']
module.exports = config
