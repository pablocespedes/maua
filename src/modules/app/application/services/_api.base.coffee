resource = (Restangular)->
  class Resource
    constructor: () ->

    restBase: (url) ->
      Restangular.all(url)

    singleBase: (url) ->
      Restangular.one(url)

    singleBaseId: (url,id) ->
      Restangular.one(url,id)

    index: (url) ->
      @restBase(url).getList()

    show: (url,id) ->
      if (id isnt null)
        @singleBaseId(url,id).get()
      else
        @singleBase(url).get()

    create: (url,data,subElm)->
      @singleBase(url).post subElm, data

    update: (url)->
      @singleBase(url)

    destroy: (id) ->
      @singleBase(url,id).remove()

    customGet:(url,id,optionals)->
      console.log url,id,optionals
      @singleBaseId(url,id).customGET '', optionals

resource.$inject = ['Restangular']
module.exports = resource