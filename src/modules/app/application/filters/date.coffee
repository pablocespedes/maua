date = ->
  (date) ->
    if date
      parsedDate = new Date(date)
      return parsedDate.getDate() + '/' + parsedDate.getMonth() + 1 + '/' +
       parsedDate.getFullYear()
    date
module.exports = date