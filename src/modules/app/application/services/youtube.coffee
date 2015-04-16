
youtube = ($q,urlsCons)->
  new class Youtube

    constructor: ()->
    setYouTubeTitle = (youtubeId) ->
      deferred = $q.defer()
      url = urlsCons.youtubeAPI + youtubeId + '?v=2&alt=json'
      $.ajax
        url: url
        dataType: 'jsonp'
        cache: true
        success: (data) ->
          secs = data.entry.media$group.yt$duration.seconds
          hours = Math.floor(secs / (60 * 60))
          divisor_for_minutes = secs % 60 * 60
          minutes = Math.floor(divisor_for_minutes / 60)
          divisor_for_seconds = divisor_for_minutes % 60
          seconds = Math.ceil(divisor_for_seconds)
          if hours < 10
            hours = '0' + hours
          if minutes < 10
            minutes = '0' + minutes
          if seconds < 10
            seconds = '0' + seconds
          # var time    = hours+':'+minutes+':'+seconds;
          time = (if hours > 0 then hours + ':' else '') +
          (if minutes > 0 then minutes + ':' else '') +
           (if seconds > 0 then seconds + ' secs' else '')
          deferred.resolve time
          return
      deferred.promise
youtube.$inject = ['$q','urlsCons']
module.exports = youtube






