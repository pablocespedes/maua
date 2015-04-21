userPreflight = ($window,$location,authorization,user,groups,
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

    checkUser: (event) ->
      console.log 'try to authenticated'
      if authorization.tokenExists()
        console.log ('authenticated')
        user.self(true).then (userResponse) ->
          console.log 'obtiene el user', userResponse, userResponse isnt null
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
                console.log urlGroup, userGroup
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
        $('body').html
        'The user is not logged in!<a href="/logout">Click here to restart</a>.'
      event.preventDefault()

userPreflight.$inject = ['$window','$location','authorization','user','groups',
'utilities','product','membership']
module.exports = userPreflight
