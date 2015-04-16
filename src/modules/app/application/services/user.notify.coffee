userNotify = (Observer)->
  new class UserNotify
    constructor: ->
      @observable = Observer.create('userNotify')

    notifyUserExists : (userExists) ->
      @observable.notify userExists

    observeUserData: ->
      Observer.get 'userNotify'

    unregisterUserData: (userNotifyObserver) ->
      @observable.unregister userNotifyObserver

userNotify.$inject = ['Observer']
module.exports = userNotify