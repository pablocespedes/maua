config = ($authProvider,apiUrl)->

$authProvider.signupUrl =apiUrl+'register'

config.$inject = ['$authProvider','apiUrl']
module.exports = config
