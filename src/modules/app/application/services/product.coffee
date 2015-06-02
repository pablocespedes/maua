product = (Observer, utilities, authorization)->
  new class Product
    constructor: ->
      @observable = Observer.create('currentProduct')
    currentGroupId : (groupId, actualGroup) ->
      currentUser = authorization.getUser()
      if utilities.existy(currentUser) and
       groupId isnt currentUser.currentGroup
        currentUser.currentGroup = groupId
        authorization.setUser currentUser
      utilities.setGroupTitle actualGroup.name
      @observable.notify groupId

    observeGroupId : ->
      Observer.get 'currentProduct'

    unregisterGroup : (groupObserver) ->
      @observable.unregister groupObserver

product.$inject = ['Observer','utilities','authorization']
module.exports = product
