class CollectionService
  constructor: () ->
    @items = []
    @lastId = 1

  add : (item) ->
    item.serviceId = @lastId++
    if !@get(item.serviceId)
      @items.push item
    return

  equals : (item, serviceId) ->
    item.serviceId == serviceId

  get : (serviceId) ->
    _.find @items, (item) =>
      @equals item, serviceId

  remove : (item) ->
    @items = _.reject(@items, (storedItem) =>
      @equals item, storedItem.serviceId
    )

 module.exports = CollectionService