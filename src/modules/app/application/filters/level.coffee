level = (levels) ->
  (input) ->
    console.log  levels
    levels.getMessage input

level.$inject = ['levels']
module.exports = level
