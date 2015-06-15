'use strict'

class DashboardController
  # Services injected into the controller constructor
  constructor: ($scope,$state,@product,@authorization,
    @dashboardService, @utilities,@membership,@userNotify,@payBanner,
    @scoreNotifier, @testCountService) ->
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
          @hidStudyPlan(groupId)
          @activeGroupId = groupId
          @getDashboard @activeGroupId
          @showBuyNow = @membership.showBuyButton() #@showPayBanner()
          @upgradePromptMessage = @membership.upgradePromptMessage()
          @canPractice = @membership.canPractice()
          @enableScore = @activeGroupId is 'gmat' or @activeGroupId is 'act' or
            @activeGroupId is 'sat'
          historyVisible = false
          baseUrl = @utilities.originalGrockit(false)
          @paymentPage = baseUrl + '/' + @activeGroupId + '/subscriptions/new'
          @studyUrl = baseUrl+ '/' + @activeGroupId + '/study_plan'
          @groupPrUrl = baseUrl + '/' + @activeGroupId + '/social'
          @customPrUrl = baseUrl + '/' + @activeGroupId + '/custom_games/new'
          @shouldShow =  @activeGroupId != 'gre'
          @testDay = @testCountService.getCountDownData(@activeGroupId)

    @loading = false

  hidStudyPlan : (groupId) ->
    @hideStudyPlan = groupId is 'ap_psychology' or
     groupId is 'ap_world_history' or groupId is 'gre' or
      groupId is 'lsat' or groupId is 'iim-cat'

  startPractice : (subject, trackId) =>
    if @canPractice
      if angular.isDefined(subject)
        if @activeGroupId is 'gre'
          @utilities.setActiveTrack subject, trackId
          @state.go 'custom-practice',
            subject: @activeGroupId
        else
          url = '/' + @activeGroupId + '/' + trackId + '/play'
          @utilities.redirect url

  hidPayment:->
    @showBuyNow = false
    @payBanner.updateBannerStat(@showBuyNow)

  showPayBanner: ->
    if @payBanner.bannerExists() then @payBanner.getBannerStatus()
    else @membership.showBuyButton()


  getDashboard : (groupId) ->
    @dashboardService.setDashboardData(groupId).then (result) =>
      hasQuestionsAnswered = @dashboardService.hasQuestionsAnswered()
      if @enableScore
        @fetchScorePrediction()
      @fetchTracks()
      @getHistoryInformation()

  fetchTracks : ->
    smartPractice = @dashboardService.getSmartPractice()
    @tracks = smartPractice.items
    @loading = false

  fetchScorePrediction : ->
    scoreResponse = @dashboardService.getScorePrediction()
    if angular.isDefined(scoreResponse)
      @score = scoreResponse

  getHistoryInformation : ->
    @historyResponse = @dashboardService.getProgress()
    if angular.isDefined(@historyResponse)
      @membership.membershipValidation @activeGroupId, @historyResponse.all


DashboardController.$inject = ['$scope','$state','product',
'authorization','dashboardService','utilities','membership','userNotify',
'payBanner','scoreNotifier','testCountService']

module.exports = DashboardController
