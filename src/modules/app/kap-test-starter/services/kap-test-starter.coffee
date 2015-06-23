
kapTestService = (resource) ->
  new class KapTestService extends resource

    constructor: ->
      super()

    init : ->

    getTracks: (groupId) ->
      @show(groupId,'dashboard')

kapTestService.$inject = ['resource']
module.exports = kapTestService



