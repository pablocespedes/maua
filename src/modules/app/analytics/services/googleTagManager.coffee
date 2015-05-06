googleTagManager =($window) ->
  new class GoogleTagManager

    constructor: ()->
    push:(data)->
      try
        $window.dataLayer.push data
      catch e

googleTagManager.$inject =['$window']
module.exports = googleTagManager