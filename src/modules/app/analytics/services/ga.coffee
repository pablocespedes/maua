googleAnalytics = ->
  new class GoogleAnalytics
    constructor: ()->
      @GA_classic_id = "UA-44112604-1"
      @GA_UA_id = "UA-44112604-4"
    classic:->
      _gaq = _gaq or []
      _gaq.push [
        '_setAccount'
        @GA_classic_id
      ]
      _gaq.push [
        '_setDomainName'
        '.grockit.com'
      ]
      _gaq.push [ '_trackPageview' ]
      _gaq.push [ '_trackPageLoadTime' ]

      ga = document.createElement('script')
      ga.type = 'text/javascript'
      ga.async = true
      ga.src = (if 'https:' == document.location.protocol
      then 'https://' else 'http://') + 'stats.g.doubleclick.net/dc.js'
      s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore ga, s

    UA:->
      ((i, s, o, g, r, a, m) ->
        i['GoogleAnalyticsObject'] = r
        i[r] = i[r] or ->
          (i[r].q = i[r].q or []).push arguments
          return

        i[r].l = 1 * new Date
        a = s.createElement(o)
        m = s.getElementsByTagName(o)[0]
        a.async = 1
        a.src = g
        m.parentNode.insertBefore a, m
        return
      ) window, document, 'script', '//www.google-analytics.com/analytics.js',
       'ga'
      ga 'create', @GA_UA_id, 'grockit.com'
      ga 'require', 'displayfeatures'
      ga 'send', 'pageview'
      return

module.exports = googleAnalytics