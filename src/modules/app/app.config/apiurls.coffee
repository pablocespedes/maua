'use strict'

apiUrls = () ->
  that = this
  this.host = 'localhost'
  this.port = 8000
  this.secure = false

  urlConstruct = (url) ->
    (if that.secure then 'https://' else 'http://') +
      that.host +
      ':' + that.port +
      url

  this.baseUrl = ->
    urlConstruct('/')

  getUrl = (name) ->
    url = urls[name]
    if !url
      throw new Error(name + " has not been defined")
    # allow the user to use a function which
    #generates the url depending on some params
    if _.isFunction(url)
      argsArray = Array.prototype.slice.call(arguments)
      argsArray.splice(0, 1)
      url = url.apply(null, argsArray)
    urlConstruct(url)

  get = () ->
    host: that.host,
    port: that.port,
    secure: that.secure,
    urls: urls,
    getUrl: getUrl

  addUrl = (url, name) ->
    if urls[name]
      throw new Error('The URL\'s name ' + name +
      ' is already registered')
    if urls[name] == url
      throw new Error('The URL ' + url +
        ' is already registered')
    urls[name] = url


  addUrls = (obj) ->
    _.forEach(obj, addUrl);


  this.addUrl = addUrl
  this.addUrls = addUrls
  this.$get = get
  urls = {}
  this

module.exports = apiUrls