module.exports = class LoginFactory
 
  constructor: (@Restangular,@authToken)->

  loginUser: (email,password) ->
    request = @Restangular("login").post "", email: email password: password
    request.then (res) =>
      @authToken.setToken(res.token)
      @userData = res
      