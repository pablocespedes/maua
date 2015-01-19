
class RegisterFactory
    
    ##cached token allow us to have the token in memory, just as
    ##little optimization to not access the token that is save on local storage.
  constructor: (Restangular,authToken)->

  registerUser: (email,password) ->
    request = Restangular("register").post "",
      email: email password: password
      request.then (res) =>
        authToken.setToken(res.token)
        @userData = res

module.exports = (Restangular,authToken)->
  new RegisterFactory(Restangular,authToken)