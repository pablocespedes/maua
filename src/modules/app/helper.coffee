module.exports = class Helper
  constructor: ()->

  getFactory: (dependencies,url) ->
    (dependencies)->
      instance = require(url)
      return new instance(dependencies)
