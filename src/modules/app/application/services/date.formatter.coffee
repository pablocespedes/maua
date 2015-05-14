dateFormatter = ()->
  new class DateFormatter

    constructor: ()->

    formatSeconds : (seconds) ->
      secs = seconds
      hours = Math.floor(secs / (60 * 60))
      divisor_for_minutes = secs % (60 * 60)
      minutes = Math.floor(divisor_for_minutes / 60)
      divisor_for_seconds = divisor_for_minutes % 60
      seconds = Math.ceil(divisor_for_seconds)
      if hours < 10
        hours = '0' + hours
      if minutes < 10
        minutes = '0' + minutes
      if seconds < 10
        seconds = '0' + seconds
      time = (if hours > 0 then hours + ':' else '') +
       (if minutes >= 0 then minutes + ':' else '') +
        (if seconds >= 0 then seconds else '')
      time

module.exports = dateFormatter