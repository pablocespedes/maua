'use strict'
entriesService = ()->
  new class EntriesServices
    # Services injected into the controller constructor
    constructor: ()->

    validateNumber : (value) ->
      if angular.isUndefined(value) or value is '' or value is null
        null
      else
        value = value * 1
        angular.isDefined(value) and value != null and !isNaN(value) and
         angular.isNumber(value)

    handleValidation : (isValid) ->
      nexAction = $('#nextAction')
      seeAnswer = $('#skipAction')
      if isValid
        nexAction.addClass 'btn-primary'
        seeAnswer.addClass 'hide'
      else
        nexAction.removeClass 'btn-primary'
        seeAnswer.removeClass 'hide'

module.exports = entriesService
