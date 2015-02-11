class CollectionService
  constructor: () ->
    @items = []
    @lastId = 1

  @add = (item) ->
    item.serviceId = @lastId++
    if !@get(item.serviceId)
      @items.push item
    return

  @equals = (item, serviceId) ->
    item.serviceId == serviceId

  @get = (serviceId) ->
    self = @
    _.find @items, (item) ->
      self.equals item, serviceId

  @remove = (item) ->
    self = @
    @items = _.reject(@items, (storedItem) ->
      self.equals item, storedItem.serviceId
    )

 module.exports = CollectionService