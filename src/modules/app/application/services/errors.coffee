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

errorHandler =  (alert)->
  new class ErrorHandler

    constructor: () ->

    getMessage = (type) ->
      httpCodes =
        200: ->
          'Success!'
        201: ->
          'Created!'
        202: ->
          'Accepted'
        400: ->
          'Bad Request'
        401: ->
          'Unauthorized'
        403: ->
          'Forbidden'
        405: ->
          'Method not Allowed'
        500: ->
          'Internal Server Error'
        501: ->
          'Service Unavailable'
        'default': ->
          'We have problems retrieving your data'
      (httpCodes[type] or httpCodes['default'])()

    checkWithAction:(message, actionText)->
      toast = $mdToast.simple()
      .content(message)
      .action(action).highlightAction(true)
      .position('top right')

      return $mdToast.show(toast)

    validateErrorType:(rejection, actionText)->
      actionText = if rejection.status is 403 then 'Upgrade' else actionText

      message = getMessage(rejection.status)
      @checkWithAction message, actionText || 'Ok'

errorHandler.$inject = ['alert']
module.exports = errorHandler


