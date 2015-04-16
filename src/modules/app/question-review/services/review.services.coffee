reviewService = (resource)->
  new class ReviewService extends resource
    constructor: ->
    getRoundSession :(groupId,rounSessionId)->
      @singleBaseId(groupId,'round_sessions').customGET rounSessionId


reviewService.$inject = ['resource']
module.exports = reviewService