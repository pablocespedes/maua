'use strict'
### @ngInject ###
class DashboardController
  # Services injected into the controller constructor
  constructor: ($window,$scope,$state,$auth,@product,@authorization) ->
    @scope = $scope
    dashObserver = null
    showingTour = false
    showTour = false
    loading = true
    isChallengeAvailable = false
    loadingMessage = 'Loading...'
    historyVisible = false
    $state.go('login') unless $auth.isAuthenticated

    @scope.$on '$destroy', ->
      @product.unregisterGroup dashObserver

  init : ->
    if @authorization.userExist()
      user_id = userInfo.userId
      dashObserver = @product.observeGroupId().register((groupId) ->
        if activeGroupId isnt groupId
          activeGroupId = groupId
          @_getDashboard activeGroupId
          showBuyNow = membershipService.showBuyButton()
          upgradePromptMessage = membershipService.upgradePromptMessage()
          canPractice = membershipService.canPractice()
          enableScore = activeGroupId is 'gmat' or activeGroupId is 'act' or
            activeGroupId is 'sat'
          historyVisible = false
          baseUrl = utilities.originalGrockit(false).url
          paymentPage = baseUrl + '/' + activeGroupId + '/subscriptions/new'
      )

  startCardinTour : ->
    angular.element(document).ready ->
      showingTour = true
      angular.element('#SnapABug_Button').attr 'style', 'display:none'
      angular.element('body').chardinJs 'start'

  startPractice : (subject, trackId) ->
    if vmDash.canPractice
      if angular.isDefined(subject)
        if activeGroupId is 'gre'
          utilities.setActiveTrack subject, trackId
          utilities.internalRedirect '/' + activeGroupId + '/custom-practice/'
        else
          url = '/' + activeGroupId + '/' + trackId + '/play'
          utilities.redirect url

  angular.element(document).ready ->
    angular.element('body').on 'chardinJs:stop', ->
      $scope.$apply ->
        angular.element('#SnapABug_Button').attr 'style', 'display:inline-block'
        showingTour = false

  _getDashboard : (groupId) ->
    dashboard.setDashboardData(groupId).then (result) ->
      hasQuestionsAnswered = dashboard.hasQuestionsAnswered()
      if not hasQuestionsAnswered and activeGroupId isnt
       'gre' and not detectUtils.isMobile()
        showTour = true

      if not hasQuestionsAnswered and
       activeGroupId is 'gre'
        base = utilities.newGrockit().url
        $window.location.href = base + '/#/' + activeGroupId +
         '/custom-practice/'
      else
        if enableScore
          @_fetchScorePrediction()
          @_fetchTracks()
          @_getHistoryInformation()
          @_getChallenge()
      return
    return

  _fetchTracks : ->
    smartPractice = dashboard.getSmartPractice()
    tracks = smartPractice.items
    loading = false

  _fetchScorePrediction : ->
    scoreResponse = dashboard.getScorePrediction()
    if angular.isDefined(scoreResponse)
      setItUpScorePrediction.setScorePrediction scoreResponse
      score = scoreResponse

  _getHistoryInformation : ->
    historyResponse = dashboard.getProgress()
    if angular.isDefined(historyResponse)
      membershipService.membershipValidation activeGroupId, historyResponse.all
    setItUpUserProgress.setUserProgress historyResponse

  _getChallenge : ->
    challenge = dashboard.getChallenge()
    if not _.isEmpty(challenge) and
     challenge.items.length > 0
      isChallengeAvailable = true
      challengesGames = challenge.items

DashboardController.$inject = ['$window','$scope','$state','$auth','product',
'authorization']

module.exports = DashboardController
