HTTPStatusCodes =
  ok : 200
  created: 201
  accepted:202
  badRequest : 400
  unauthorized : 401
  forbidden: 403
  methodNotAllowed:405
  internalServerError: 500
  serviceUnavailable:503

errorHandler =  (alert,utilities)->
  new class ErrorHandler

    constructor: () ->

    getMessage = (type) ->
      httpCodes =
        400: ->
          'Bad Request'
        401: ->
          'Unauthorized'
        403: ->
          'The account being accessed does not have sufficient permissions'
        404: ->
          'The specified resource does not exist.'
        405: ->
          'Method not Allowed'
        500: ->
          'The server encountered an internal error.'
        501: ->
          'Service Unavailable'
        'default': ->
          'We have problems retrieving your data'
      (httpCodes[type] or httpCodes['default'])()


    validateErrorType:(rejection, actionText)->
      actionText = if rejection.status is 403 then 'Upgrade' else actionText

      message = getMessage(rejection.status)
      alert.sendError message, (actionText || 'Ok'), utilities.upgradeRedirect

errorHandler.$inject = ['alert','utilities']
module.exports = errorHandler


