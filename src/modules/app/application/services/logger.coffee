class Logger
  @inject: ['$log']
  constructor: (@options) ->
  send: (args) ->
    $log.log('sending', args)
      
module.exports = Logger