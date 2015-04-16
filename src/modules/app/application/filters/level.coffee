level = (levels) ->
  (input) ->
    levels.getMessage input

level.$inject = ['levels']
module.exports = level
