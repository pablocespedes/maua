'use strict'

class DashboardController
  # Services injected into the controller constructor
  constructor: ($window,$scope,$state,$auth,@product,@authorization,
    @dashboardService, @utilities,@membership,@userNotify) ->
    @utilities.currentPage 'Dashboard'
    @state=$state
    userObserver = null
    dashObserver = null
    showingTour = false
    showTour = false
    @loading = true
    isChallengeAvailable = false
    historyVisible = false
    #$state.go('login') unless $auth.isAuthenticated
    $scope.$on '$destroy', () ->
      $scope.vmDash.product.unregisterGroup $scope.vmDash.dashObserver
      $scope.vmDash.userNotify.unregisterUserData $scope.vmDash.userObserver

    @userObserver = @userNotify.observeUserData().register (userExist) =>
      @init()

  init : ->
    if @authorization.userExist()
      userInfo = @authorization.getUser()
      user_id = userInfo.userId
      @dashObserver = @product.observeGroupId().register (groupId) =>
        if @activeGroupId isnt groupId
          @activeGroupId = groupId
          @_getDashboard @activeGroupId
          @showBuyNow = @membership.showBuyButton()
          @upgradePromptMessage = @membership.upgradePromptMessage()
          @canPractice = @membership.canPractice()
          @enableScore = @activeGroupId is 'gmat' or @activeGroupId is 'act' or
            @activeGroupId is 'sat'
          historyVisible = false
          baseUrl = @utilities.originalGrockit(false)
          @paymentPage = baseUrl + '/' + @activeGroupId + '/subscriptions/new'

  startPractice : (subject, trackId) =>
    if @canPractice
      if angular.isDefined(subject)
        if @activeGroupId is 'gre'
          @utilities.setActiveTrack subject, trackId
          @state.go 'custom-practice',
            subject: @activeGroupId
        #@utilities.internalRedirect '/' + @activeGroupId + '/custom-practice/'
        else
          url = '/' + @activeGroupId + '/' + trackId + '/play'
          @utilities.redirect url

  _getDashboard : (groupId) ->
    @dashboardService.setDashboardData(groupId).then (result) =>
      hasQuestionsAnswered = @dashboardService.hasQuestionsAnswered()
      if not hasQuestionsAnswered and activeGroupId isnt
       'gre' and not detectUtils.isMobile()
        showTour = true

      if not hasQuestionsAnswered and
       activeGroupId is 'gre'
        base = @utilities.newGrockit().url
        $window.location.href = base + '/#/' + @activeGroupId +
         '/custom-practice/'
      else
        #if @enableScore
         # @_fetchScorePrediction()
        @_fetchTracks()
        # @_getHistoryInformation()
        @_getChallenge()

  _fetchTracks : ->
    smartPractice = @dashboardService.getSmartPractice()
    @tracks = smartPractice.items
    @loading = false

  _fetchScorePrediction : ->
    scoreResponse = @dashboardService.getScorePrediction()
    if angular.isDefined(scoreResponse)
      setItUpScorePrediction.setScorePrediction scoreResponse
      @score = scoreResponse

  _getHistoryInformation : ->
    historyResponse = @dashboardService.getProgress()
    if angular.isDefined(historyResponse)
      membership.membershipValidation activeGroupId, historyResponse.all
    setItUpUserProgress.setUserProgress historyResponse

  _getChallenge : ->
    challenge = @dashboardService.getChallenge()
    if not _.isEmpty(challenge) and
     challenge.items.length > 0
      isChallengeAvailable = true
      challengesGames = challenge.items

DashboardController.$inject = ['$window','$scope','$state','$auth','product',
'authorization','dashboardService','utilities','membership','userNotify']

module.exports = DashboardController
