class Storage
  constructor:() ->
    @storage = window.localStorage
  save:(key,object) ->
    @storage.setItem(key, JSON.stringify(object))
  get:(key) ->
    value = @storage.getItem(key)
    return value && JSON.parse(value)
  remove:(key)->
    @storage.removeItem key

module.exports = Storage

