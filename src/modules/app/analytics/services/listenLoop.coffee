listenloop = ->
  new class ListenLoop

    constructor: ()->
    loadScript = (userData) ->
      $('<script>' + 'function fkVisitorData(){' +
       'return {' + '"email":"' + userData.emailAddress +
       '",' + '"segment":"' + userData.role + '",' +
       '"custom_properties":{' + '"first_name":"' +
       userData.firstName + '",' + '"user_id":"' +
       userData.userId + '",' + '"group":"' +
       userData.currentGroup + '",' + '"env":"Grockit 2.0"' +
      '}' + '}' +
      '}' + '</script>').appendTo document.body
      return

    initialize : (userData) ->
      loadScript userData
      fks = document.createElement('script')
      fks.type = 'text/javascript'
      fks.async = true
      fks.setAttribute 'fk-userid', '136'
      fks.setAttribute 'fk-server', 'fkapp.herokuapp.com'
      fks.src = (if 'https:' == document.location.protocol
      then 'https://' else 'http://') +
       'd1g3gvqfdsvkse.cloudfront.net/assets/featurekicker.js'
      s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore fks, s
      return


module.exports = listenloop