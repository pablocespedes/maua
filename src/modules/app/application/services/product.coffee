Storage =require('./_storage')

product = (Observer, utilities)->
  new class Product extends Storage
    constructor: ->
      super()
      @currentUser = @get('userInfo')
      @observable = Observer.create('currentProduct')
    currentGroupId : (groupId, actualGroup) ->
      if @currentUser isnt null and groupId isnt @currentUser.currentGroup
        @currentUser.currentGroup = groupId
        console.log 'set new group', groupId
        @save 'userInfo', @currentUser
      utilities.setGroupTitle actualGroup.name
      @observable.notify groupId

    observeGroupId : ->
      Observer.get 'currentProduct'

    unregisterGroup : (groupObserver) ->
      @observable.unregister groupObserver

product.$inject = ['Observer','utilities']
module.exports = product
