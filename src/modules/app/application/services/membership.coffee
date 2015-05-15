
membership = ($sce,lifeCycle, utilities,appMessages)->
  new class Membership
    constructor: ->
      @memberInfo={}
    _isPremium : ->
      @memberInfo.becamePremiumAt isnt null

    _premiumNotHasExpired : ->
      @memberInfo.lifeCycle isnt lifeCycle.inactive and
       @memberInfo.lifeCycle isnt lifeCycle.freeTrialExpired

    _hasPrompt : ->
      @memberInfo.upgradePrompt isnt null

    _isTrialing : ->
      @memberInfo.lifeCycle is lifeCycle.freeTrial or
       @memberInfo.lifeCycle is lifeCycle.questionLimit

    _validateMembership : ->
      !@_premiumNotHasExpired() and !@_isTrialing()

    setMembershipInfo : (userResponse, groupUserInfo) ->

      @memberInfo.upgradePrompt = groupUserInfo.upgrade_prompt
      @memberInfo.becamePremiumAt = userResponse.becamePremiumAt
      @memberInfo.expiredAt = groupUserInfo.expires_at
      @memberInfo.trialing = groupUserInfo.trialing
      @memberInfo.lifeCycle = groupUserInfo.lifecycle
    showBuyButton : ->
      !@_premiumNotHasExpired() or @_isTrialing()

    canPractice : ->
      @_premiumNotHasExpired()

    membershipValidation : (groupId, nQuestions) ->
      if @_validateMembership()
        message = if @_hasPrompt() then @memberInfo.upgradePrompt
        else appMessages.freeTrialExpired
        #include material dialog
        #grockitModal.showTrialExpiration message, groupId, nQuestions
      return

    userCanAccesPage : (groupId) ->

      if @_validateMembership() and utilities.lastUrlWord() isnt 'dashboard'
        utilities.upgradeRedirect(groupId)
      return

    upgradePromptMessage : ->
      if @_hasPrompt() then $sce.trustAsHtml(@memberInfo.upgradePrompt)
      else $sce.trustAsHtml(appMessages.freeTrialExpired)



membership.$inject = ['$sce','lifeCycle','utilities',
'appMessages']
module.exports = membership
