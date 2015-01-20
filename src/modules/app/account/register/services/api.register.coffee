module.exports = ['Restangular','authToken',(Restangular,authToken) ->
  new class RegisterService

    constructor: () ->
            
    registerUser: (email,password) ->
      request = Restangular.one("register").post "",
        email: email
        password: password
      request.then (res) ->
        authToken.setToken(res.token)
        @userData = res
]