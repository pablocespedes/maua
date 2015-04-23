
user = ($q,resource,authorization,userRoles,imgVersion,userNotify)->
  new class User extends resource

    constructor: ()->
      super()
    _defaultGroup = (user) ->
      if user != null and angular.isDefined(user.currentGroup)
      then user.currentGroup else undefined

    _setUserData = (response,user) ->
      currentUser =
        userId: response.id
        role: if response.guest then userRoles.guest else userRoles.member
        groupMemberships: response.group_memberships
        currentGroup: if angular.isDefined(_defaultGroup(user))
        then _defaultGroup(user)
        else response.group_memberships[0].group_id
        firstName: response.first_name
        fullName: response.full_name
        avatarUrl: if angular.isDefined(response.avatar_url) or
         response.avatar_url != null
         then response.avatar_url.replace('version', imgVersion.thumbnail)
         else 'images/avatar.png'
        emailAddress: response.email_address
        becamePremiumAt: response.became_premium_at
      authorization.setUser(currentUser)
      currentUser
    self :(wantUpdate) ->
      deferred = $q.defer()
      user = authorization.getUser()
      if not user or wantUpdate
        @show('users','self').then (result) ->
          user= _setUserData(result.data.user,user)
          authorization.setUser(user)
          userNotify.notifyUserExists(true)
          deferred.resolve(user)
          return
      else
        userNotify.notifyUserExists(true)
        deferred.resolve(user)
      deferred.promise

    scorePrediction = (userId, activeGroupId) ->
      users.one().one(userId).customGET 'score_prediction', group: activeGroupId

    history = (userId, activeGroupId, trackId) ->
      users.one().one(userId).customGET 'history',
        group: activeGroupId
        trackId: trackId


user.$inject = ['$q','resource','authorization','userRoles','imgVersion',
'userNotify']
module.exports = user