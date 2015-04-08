truncate = ->
  (text, chars) ->
    if !text
      return text
    ellipses = '...'
    text.substr(0, chars) + ellipses
module.exports = truncate