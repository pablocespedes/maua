htmlToPlaintext = ->
  (text) ->
    String(text).replace /<[^>]+>/gm, ''
module.exports = htmlToPlaintext