'use strict'

### @ngInject ###

class AppController

  constructor: ($scope, $window, @utilities, @user,@product, @groups,
    @authorization,$mdSidenav,@menuService,@membership)->
    @mdSidenav = $mdSidenav
    @scope = $scope
    @window = $window
    @userProgressObserver = null
    @scorePrediction = null
    @activeGroupId=null
    @currentUser = null
    if(@authorization.userExist())
      @_init()

    @scope.$on '$destroy', =>
      @product.unregisterGroup @userProgressObserver

  hideVideoOption : (groupId) ->
    @hideVideoOption = groupId is 'ap_calculus' or
     groupId is 'ap_psychology' or groupId is 'ap_us_history' or
      groupId is 'ap_world_history' or groupId is 'academy' or
       groupId is 'iim-cat'
    return

  hideStudyPlan : (groupId) ->
    @hideStudyPlan = groupId is 'ap_psychology' or
     groupId is 'ap_world_history' or groupId is 'gre' or
      groupId is 'lsat' or groupId is 'iim-cat'
    return

  toggleList:() ->
    @mdSidenav('left').toggle()

  groupRedirect:(id) ->
    @activeGroupId=id

    @utilities.redirect '#/'+ id + '/dashboard'

  selectGroup : (index) ->

    ###update group Name###
    @utilities.setGroupTitle @ugroups.linkedGroups[index].name
    currentGroupId = @ugroups.linkedGroups[index].id
    @product.currentGroupId currentGroupId

  _loadGroupMembership:(groupId) ->
    @ugroups =
      linkedGroups: []
      unLinkedGroups: []
    if @currentUser.groupMemberships.length > 0
      @groups.membershipGroups(true).then((result) =>
        responseGroups = result.data.groups
        if (!!responseGroups)

          studyingFor = _.find responseGroups, 'id': groupId
          if angular.isDefined(studyingFor)
            @utilities.setGroupTitle studyingFor.name
          linkedGroups = @currentUser.groupMemberships
          len = linkedGroups.length
          i = 0
          while i < len
            lG = linkedGroups[i]
            if (!!lG)
              linkGroupFilter = 'id': lG.group_id
              linkGroup = _.find(responseGroups, linkGroupFilter)
              if angular.isDefined(linkGroup)
                @ugroups.linkedGroups.push linkGroup
                indexToRemove =
                  @utilities.getIndexArray(responseGroups, 'id', lG.group_id)
                responseGroups.splice indexToRemove, 1
            i++
          @ugroups.unLinkedGroups = responseGroups
          @activeGroupId = groupId
      ).catch (e) ->
        alerts.showAlert alerts.setErrorApiMsg(e), 'danger'
    else
      alerts.showAlert appMessages.noGroupsFound, 'warning'

  _getUserProgress: ->
    @userProgressObserver = setItUpUserProgress.observeUserProgress()
      .register((historyResponse) ->
        userProgess = {}
        if angular.isDefined(historyResponse)
          userProgess.historyVisible = true
          userProgess.totalQuestLastW = historyResponse.lastWeek
          userProgess.totalQuest = historyResponse.all
          userProgess.totalQuestToday = historyResponse.today
        else
          userProgess.historyVisible = false
        @historyInfo = userProgess
    )

  _getScorePrediction: ->
    scorePrediction = setItUpScorePrediction.observeScorePrediction()
    .register((scoreResponse) ->
      @score = scoreResponse
      @scoreLoading = false
    )

  _setInitialData: (response, groupId) ->
    if @activeGroupId isnt groupId
      @enableScore = groupId is 'gmat' or groupId is 'act' or
      groupId is 'sat'
      #if @enableScore
        #@_getScorePrediction()
      gtmData =
        'platformVersion': '2'
        'studyingFor': groupId
        'userId': response.userId
      #GoogleTagManager.push gtmData

      menuParams =
        isReady: true
        groupId: groupId

      @canAccess = @membership.canPractice()

      @hideVideoOption(groupId)
      @hideStudyPlan(groupId)
      @menu = @menuService.createLeftMenu(menuParams, @hideStudyPlan,
        @hideVideoOption, @canAccess)

      @_loadGroupMembership(groupId)
      #ListenloopUtility.base response
      #Application.getUserProgress()
      url = @window.location.href.split('/')
      currentLoc = url[url.length - 1]
      @activeItem = currentLoc

  _init: ->
    @user.self(true).then((response) =>
      if response != null
        @currentUser = response
        #@_setInitialData @currentUser, @currentUser.currentGroup
        @userProgressObserver = @product.observeGroupId()
        .register((groupId) =>
          @_setInitialData response, groupId
          return
        )
        #GaUtility.classic()
        #GaUtility.UA()
        #InspectletUtility.base()
    ).catch (e) ->
      console.log e
      #alerts.showAlert alerts.setErrorApiMsg(e), 'danger'


 AppController.$inject = ['$scope', '$window', 'utilities', 'user','product',
'groups','authorization','$mdSidenav','menuService','membership']

module.exports = AppController