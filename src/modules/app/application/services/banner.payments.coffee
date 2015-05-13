Storage =require('./_storage')

paymentBanner = (Observer,utilities)->
  new class PaymentBanner extends Storage

    constructor: ->
      super()
      @observable = Observer.create('paymentBanner')

    observePayBanner : ->
      Observer.get 'paymentBanner'

    unregisterPayBanner : (payBannerObserver) ->
      @observable.unregister payBannerObserver

    updateBannerStat:(status)->
      bannerStatus = 'status':status
      @save 'paymentBanner', bannerStatus
      @observable.notify status

    bannerExists:->
      utilities.existy(@get('paymentBanner'))

    getBannerStatus:->
      @get('paymentBanner').status


paymentBanner.$inject = ['Observer','utilities']
module.exports =   paymentBanner