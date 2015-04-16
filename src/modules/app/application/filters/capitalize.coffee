capitalize = ->
  (input, all) ->
    if ! !input then input.replace(/([^\W_]+[^\s-]*) */g, ((txt) ->
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )) else ''
module.exports = capitalize