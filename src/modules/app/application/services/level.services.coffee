
levels = ()->
  new class Levels
    constructor: ()->
      @messages =
        2: 'Lowest'
        4: 'Low'
        8: 'Medium'
        16: 'High'
        32: 'Highest'
    getMessage : (level) ->
      @messages[level]

module.exports = levels