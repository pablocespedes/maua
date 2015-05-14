braintree = require('braintree-web')

braintreeFactory = (resource)->
  new class BraintreeFactory extends resource
    constructor:() ->
      super()
      @bt= {}
      @bt.clientToken = null
      _.forEach braintree, (key)=>
        @bt[key] = braintree[key]

    getClientToken:->
      @show('client_token')

    setupDropin:(options)->
      @getClientToken().then (token)->
        braintree.setup token, 'dropin', options



braintreeFactory.$inject = ['resource']
module.exports = braintreeFactory