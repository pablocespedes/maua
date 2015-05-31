'use strict'

class DashboardController
  # Services injected into the controller constructor
  constructor: ($scope,$state,@product,@authorization,
    @dashboardService, @utilities,@membership,@userNotify,@payBanner,
    @scoreNotifier) ->
    @utilities.currentPage 'Dashboard'
    @state=$state
    @userObserver = null
    @dashObserver = null
    @paymentMsgObs = null
    showingTour = false
    showTour = false
    @loading = true
    @isChallengeAvailable = false
    historyVisible = false

    $scope.$on '$destroy', () ->
      $scope.vmDash.product.unregisterGroup $scope.vmDash.dashObserver
      $scope.vmDash.dashObserver = null
      $scope.vmDash.userNotify.unregisterUserData $scope.vmDash.userObserver
      $scope.vmDash.userObserver = null
      $scope.vmDash.paymentMsgObs.unregisterPayBanner
      $scope.vmDash.paymentMsgObs
      $scope.vmDash.paymentMsgObs = null
      return

    @userObserver = @userNotify.observeUserData().register (userExist) =>
      @loading = true
      @init()

    @paymentMsgObs = @payBanner.observePayBanner().register (status) =>
      @showBuyNow = status


  init : ->
    if @authorization.userExist()
      userInfo = @authorization.getUser()
      user_id = userInfo.userId
      @dashObserver = @product.observeGroupId().register (groupId) =>
        if @activeGroupId isnt groupId
          @activeGroupId = groupId
          @_getDashboard @activeGroupId
          @showBuyNow = @showPayBanner()
          @upgradePromptMessage = @membership.upgradePromptMessage()
          @canPractice = @membership.canPractice()
          @enableScore = @activeGroupId is 'gmat' or @activeGroupId is 'act' or
            @activeGroupId is 'sat'
          historyVisible = false
          baseUrl = @utilities.originalGrockit(false)
          @paymentPage = baseUrl + '/' + @activeGroupId + '/subscriptions/new'
    @loading = false

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

  hidPayment:->
    @showBuyNow = false
    @payBanner.updateBannerStat(@showBuyNow)

  showPayBanner: ->
    if @payBanner.bannerExists() then @payBanner.getBannerStatus()
    else @membership.showBuyButton()


  _getDashboard : (groupId) ->
    @dashboardService.setDashboardData(groupId).then (result) =>
      hasQuestionsAnswered = @dashboardService.hasQuestionsAnswered()

      # if not hasQuestionsAnswered and
      #  @activeGroupId is 'gre'
      #   @state.go 'custom-practice',
      #       subject: @activeGroupId

      # else
      if @enableScore
        @_fetchScorePrediction()
      @_fetchTracks()
        # @_getHistoryInformation()

  _fetchTracks : ->
    smartPractice = @dashboardService.getSmartPractice()
    @tracks = smartPractice.items
    @loading = false

  _fetchScorePrediction : ->
    scoreResponse = @dashboardService.getScorePrediction()
    if angular.isDefined(scoreResponse)
      @scoreNotifier.setScore scoreResponse
      @score = scoreResponse

  _getHistoryInformation : ->
    historyResponse = @dashboardService.getProgress()
    if angular.isDefined(historyResponse)
      membership.membershipValidation activeGroupId, historyResponse.all
    setItUpUserProgress.setUserProgress historyResponse


DashboardController.$inject = ['$scope','$state','product',
'authorization','dashboardService','utilities','membership','userNotify',
'payBanner','scoreNotifier']

module.exports = DashboardController
