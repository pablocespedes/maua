'use strict'
class HistoryController
  # Services injected into the controller constructor
  constructor: ($scope, $state, $auth, @history, @product, @collapseManager) ->
    @scope = $scope
    #$state.go('login') unless $auth.isAuthenticated
    console.log  'history asd'
    @productObserver = @product.observeGroupId().register((groupId) =>
      console.log 'test history'
      @updateGroupId(groupId)
      return
    )
    @loading = true
    @isRequesting = false
    @history.reset()
    @collapseManager.reset()

    # @scope.$on '$destroy', =>
    #   @product.unregisterGroup @productObserver

  getQuestions : ->
    @loading = true
    if not @isRequesting
      @isRequesting = true
      @history.loadQuestions(@groupId).then (parsedQuestions) =>
        @isRequesting = false
        @loading = false
        @questionsPerDay = parsedQuestions

  isLastEntryLoading : (id) ->
    @loading and @collapseManager.isLastEntry(id)

  onCollapse : ->
    if @collapseManager.areAllCollapsed()
      @getQuestions()

  updateGroupId : (groupId) ->
    console.log 'hist'
    if @groupId isnt groupId
      @groupId = groupId
      @getQuestions()

HistoryController.$inject = ['$scope','$state','$auth','history','product',
'collapseManager']

module.exports = HistoryController