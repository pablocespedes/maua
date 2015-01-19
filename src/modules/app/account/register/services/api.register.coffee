module.exports = ['Restangular','authToken',(Restangular,authToken) ->
  new class RegisterService

    constructor: () ->
            
    registerUser: (email,password) ->
      console.log(Restangular)
      request = Restangular.one("register").post "",
        email: email
        password: password
      request.then (res) ->
        console.log(res)
        ##authToken.setToken(res.token)
        ##@userData = res
]