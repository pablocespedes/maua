inspectLet = ->
  new class InspectLet
    constructor: ()->
    initialize:->

      window.__insp = window.__insp or []
      __insp.push [
        'wid'
        2086641618
      ]
      do ->
        __ldinsp = ->
          insp = document.createElement('script')
          insp.type = 'text/javascript'
          insp.async = true
          insp.id = 'inspsync'
          insp.src = (if 'https:' == document.location.protocol
          then 'https' else 'http') + '://cdn.inspectlet.com/inspectlet.js'
          x = document.getElementsByTagName('script')[0]
          x.parentNode.insertBefore insp, x
          return

        if window.attachEvent
          window.attachEvent 'onload', __ldinsp
        else
          window.addEventListener 'load', __ldinsp, false
        return

module.exports = inspectLet