time = ->
  (date) ->
    if date
      parsedDate = new Date(date)
      hours = parsedDate.getHours()
      minutes = parsedDate.getMinutes()
      seconds = parsedDate.getSeconds()
      period = if hours > 12 then 'pm' else 'am'
      hours = if hours > 12 then hours - 12 else hours
      minutes = if minutes < 10 then '0' + minutes else minutes
      seconds = if seconds < 10 then '0' + seconds else seconds
      return hours + ':' + minutes + ':' + seconds + ' ' + period
    date
module.exports = time