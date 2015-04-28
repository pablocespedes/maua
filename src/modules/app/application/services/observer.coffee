observer = () ->
  new class Observer
    constructor: ->
      @observables = []
    create: (key) ->
      if @get(key)
        return false
      observable =
        key: key
        lastId: 0
        observers: []
        notify: (data) ->
          _.forEach @observers, (observer) ->
            observer.callback data
            return
          return
        register: (callback) ->
          observer =
            id: @lastId++
            callback: callback
          @observers.push observer
          observer
        unregister: (observer) ->
          console.log @observers, observer
          @observers = _.reject(@observers, 'id': observer.id)
          console.log @observers
          return
      @observables.push observable
      observable
    get: (key) ->
      _.find @observables, 'key': key

module.exports = observer
