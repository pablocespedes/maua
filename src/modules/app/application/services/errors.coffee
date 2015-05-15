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

errorHandler = (alert) ->
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

    check:(message)->
      alert.simple message

    checkWithAction:(message, actionText)->
      alert.withAction message, actionText

    validateErrorType:(response, actionText)->
      console.log response
      message = getMessage(response.status)
      console.log message
      @checkWithAction message, actionText




errorHandler.$inject = ['alert']
module.exports = errorHandler


