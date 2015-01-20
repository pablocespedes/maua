module.exports = ['Restangular','authToken',(Restangular,authToken) ->
  new class LoginService

    constructor: () ->
            
    signUser: (email,password) ->
      request = Restangular.one("login").post "",
        email: email
        password: password
      request.then (res) ->
        authToken.setToken(res.token)
        @userData = res
]