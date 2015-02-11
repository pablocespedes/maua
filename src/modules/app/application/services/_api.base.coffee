class Resource
  constructor: (@Restangular,@url) ->

  restBase: () ->
    @Restangular.all(@url)

  singleBase: (id) ->
    @Restangular.one(@url, id)

  index: () ->
    @restBase(@url).getList()

  show: (id) ->
    @singleBase(@url,id).get()

  save: (data,subElm)->
    @singleBase(@url).post subElm, data

  update: ()->
    @singleBase(@url)

  destroy: (id) ->
    @singleBase(@url,id).remove()

module.exports = Resource