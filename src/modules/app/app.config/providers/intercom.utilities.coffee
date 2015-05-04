_capitalize_ = (string) ->
  if !string then '' else string.charAt(0).toUpperCase() +
   string.substring(1).toLowerCase()

createScript = (url, appID) ->
  console.log 'TRY TO CREATE SCRIPT'

  if !document
    return
  script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = url + appID
  # Attach the script tag to the document head
  s = document.getElementsByTagName('head')[0]
  s.appendChild script
  return

if window.Intercom and global and !global.Intercom
  global.Intercom = window.Intercom

intercomSettings = global.IntercomSettings or global.intercomSettings
intercom_exist = false

# if intercom exist then reattach
if angular.isFunction(window.Intercom)
  global.Intercom 'reattach_activator'
  if intercomSettings
    global.Intercom 'update', intercomSettings
  intercom_exist = true
else
  # build Intercom for async loading
  # see commented out code at the bottom for more details

  build_intercom = ->
    build_intercom.c arguments
    return

  build_intercom.q = []

  build_intercom.c = (args) ->
    build_intercom.q.push args
    return

  global.Intercom = build_intercom
  instance = false
  config =
    'asyncLoading': false
    'scriptUrl': 'https://widget.intercom.io/widget/'
    'appID': ''
    'development': false

$IntercomProvider = ->
  provider = this
  angular.forEach config, (val, key) ->

    provider[key] = (newValue) ->
      config[key] = newValue or val
      provider

    return
  console.log provider
  provider.$get = [
    '$rootScope'
    'IntercomSettings'
    ($rootScope,IntercomSettings) ->
      # warn the user if they inject both $intercom and Intercom

      $intercom = ->
        global.Intercom.apply global.Intercom, arguments
        $intercom

      buildMethod = (func, method) ->
        $intercom[method] = func

        $intercom['$' + method] = ->
          func.apply Intercom, arguments
          if !$rootScope.$$phase
            $rootScope.$apply()
          $intercom

        return

      if instance
        console.log 'Consider using either $intercom or Intercom not both'
      instance = true
      _options = {}
      # ensure appID is added to _options
      console.log config,_options,$intercom
      if config.appID
        _options.app_id = _options.app_id or config.appID
      angular.extend _options, IntercomSettings
      if intercom_exist
        global.Intercom 'reattach_activator'
        global.Intercom 'update', _options
        console.log config
      if config.asyncLoading
        createScript config.scriptUrl, config.appID

      methods =
        boot: (options) ->
          angular.extend _options, options or {}
          if !_options.app_id and config.appID
            _options.app_id = config.appID
          if options.app_id and options.app_id != _options.app_id
            _options.app_id = options.app_id
          global.Intercom 'boot', _options
          $intercom
        update: (data) ->
          if data
            if !data.app_id and config.appID
              data.app_id = config.appID
            if data.app_id and data.app_id != config.app_id
              config.app_id = data.app_id
            global.Intercom 'update', data
          else
            global.Intercom 'update'
          $intercom
        trackEvent: (eventName, data) ->
          global.Intercom 'trackEvent', eventName, data
          $intercom
        showMessages: ->
          global.Intercom 'showMessages'
          $intercom
        showNewMessage: (data) ->
          if data
            global.Intercom 'showNewMessage', data
          else
            global.Intercom 'showNewMessage'
          $intercom
        hideMessages: ->
          # Not sure this is even a real intercom api
          global.Intercom 'hideMessages'
          $intercom
        shutdown: ->
          global.Intercom 'shutdown'
          $intercom
        hide: ->
          global.Intercom 'hide'
          $intercom
        show: ->
          global.Intercom 'show'
          $intercom
        reattachActivator: ->
          global.Intercom 'reattach_activator'
          $intercom

      angular.forEach methods, buildMethod

      isEvent =
        'show': true
        'hide': true
        'activatorClick': true

      $intercom.$on = (event, callback) ->
        if !isEvent[event]
          return
        global.Intercom 'on' + _capitalize_(event), ->
          if $rootScope.$$phase
            callback()
          else
            $rootScope.$apply callback
          return
        $intercom

      $intercom.on = (event, callback) ->
        if !isEvent[event]
          return
        global.Intercom 'on' + _capitalize_(event), callback
        $intercom

      $intercom.$$defineMethod = (method) ->
        if !method
          return
        buildMethod method, ->
          args = Array::slice.call(arguments)
          global.Intercom.apply global.Intercom, args.unshift(method)
          $intercom
        return

      $intercom
  ]
  # end $get
  return

module.exports = $IntercomProvider