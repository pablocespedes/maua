formatSeconds = (dateFormatter) ->
  (seconds) ->
    dateFormatter.formatSeconds seconds

formatSeconds.$inject = ['dateFormatter']
module.exports = formatSeconds