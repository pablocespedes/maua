
groups = (resource)->
  new class Groups extends resource

    constructor: ()->
      super()

    membershipGroups : (shouldUpdate) ->
      optionals =
      'subdomain': 'www'
      currentGroups =
      if currentGroups is null or shouldUpdate
      then @customGet('groups','',optionals)
      else currentGroups
      currentGroups

groups.$inject = ['resource']
module.exports = groups