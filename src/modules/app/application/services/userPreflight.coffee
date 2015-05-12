userPreflight = ($window,$location,intercom ,authorization,user,groups,
  utilities,product,membership)->
  new class UserPreflight
    constructor: ->
    _actualGroup = (uGroups, urlGroup) ->
      _.find uGroups, 'id': urlGroup
    _userGroup = (gMembership, urlGroup) ->
      _.find gMembership, 'group_id': urlGroup
    _isBasePath = (userResponse) ->
      $location.path() == '/' or $location.path() == '/' +
      userResponse.currentGroup or $location.path() == ''
    _userIntercom = (userResponse) ->
      intercomSettings =
        user_id: userResponse.userId
        name: userResponse.fullName
        email: userResponse.emailAddress
        updated_at: Math.floor(Date.now() / 1000)
        group:userResponse.currentGroup
        member: if userResponse.becamePremiumAt == null
        then 'Free Trial' else 'Premium'
        'widget': 'activator': '#Intercom'
      intercom.update intercomSettings
      return
    checkUser: (event) ->
      if authorization.tokenExists()
        user.self(true).then (userResponse) ->
          _userIntercom(userResponse)
          if userResponse isnt null

            groups.membershipGroups(true).then (groupsResult) ->
              uGroups = groupsResult.data.groups
              if _isBasePath(userResponse)
                utilities.internalRedirect '/' +
                userResponse.currentGroup + '/dashboard'
                return
              else
                urlGroup = utilities.getCurrentParam('subject')
                userGroup = _userGroup(userResponse.groupMemberships, urlGroup)
                actualGroup = _actualGroup(uGroups, urlGroup)
                if angular.isUndefined(actualGroup)
                  #$window.location = '404.html'
                else if angular.isUndefined(userGroup)
                  baseUrl = utilities.originalGrockit(false)
                  utilities.redirect baseUrl + '/' + urlGroup +
                  '/subscriptions/new'
                  return
                else
                  membership.setMembershipInfo userResponse, userGroup
                  membership.userCanAccesPage urlGroup
                  product.currentGroupId urlGroup, actualGroup
                  return
      else
        $('body').html 'The user is not logged in!<a href="/logout">'+
          'Click here to restart</a>.'
      event.preventDefault()

userPreflight.$inject = ['$window','$location','intercom', 'authorization',
'user','groups','utilities','product','membership']
module.exports = userPreflight
