storage = ($cookies)->
  new class Storage
    constructor:() ->
      @storage = window.localStorage
      @hasLocalStorage = @testLocalStorage()

    save:(key,object) ->
      if @hasLocalStorage
        try
          @storage.setItem(key, JSON.stringify(object))
        catch e
      else if key isnt 'userInfo'
        $cookies.putObject key, object

    get:(key) ->
      if @hasLocalStorage
        value = @storage.getItem(key)
        value && JSON.parse(value)
      else
        $cookies.getObject key

    remove:(key)->
      if @hasLocalStorage then @storage.removeItem key else @removeCookie key

    testLocalStorage: ->
      try
        @storage.setItem 'storage.test', true
        @storage.removeItem 'storage.test'
        return true
      catch e
        return false
      return

    getCookie: (key)->
      $cookies.get key

    removeCookie: (key)->
      $cookies.remove key

storage.$inject = ['$cookies']
module.exports = storage

