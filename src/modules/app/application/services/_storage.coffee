class Storage
  constructor:() ->
    @storage = window.localStorage
  save:(key,object) ->
    @storage.setItem(key, object)
  get:(key) ->
    @storage.getItem(key)
  remove:(key)->
    @storage.removeItem key

module.exports = Storage

