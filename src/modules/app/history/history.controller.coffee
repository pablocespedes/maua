'use strict'
class HistoryController
  # Services injected into the controller constructor
  constructor: ($scope, $state, $auth, @history, @product, @collapseManager) ->
    @loading = true
    @isRequesting = false
    @history.reset()
    @collapseManager.reset()
    @productObserver = @product.observeGroupId().register (groupId) =>
      @updateGroupId(groupId)
    $scope.$on '$destroy', ->
      console.log 'destroy history observers'
      $scope.vmHist.product.unregisterGroup $scope.vmHist.productObserver

  getQuestions : ->
    #here history
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