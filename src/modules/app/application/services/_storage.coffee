class Storage
  constructor:() ->
    @storage = window.localStorage
    @hasLocalStorage = @testLocalStorage()

  save:(key,object) ->
    if @hasLocalStorage
      try
        @storage.setItem(key, JSON.stringify(object))
        console.log 'write the object', key
      catch e
        console.log 'local storage is not supported'


  get:(key) ->
    value = @storage.getItem(key)
    return value && JSON.parse(value)

  remove:(key)->
    @storage.removeItem key

  testLocalStorage: ->
    try
      localStorage.setItem prefix + 'angular.webStorage.test', true
      localStorage.removeItem prefix + 'angular.webStorage.test'
      return true
    catch e
      return false
    return

module.exports = Storage

