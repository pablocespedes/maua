paymentBanner = (Observer,utilities,storage)->
  new class PaymentBanner

    constructor: ->
      @observable = Observer.create('paymentBanner')

    observePayBanner : ->
      Observer.get 'paymentBanner'

    unregisterPayBanner : (payBannerObserver) ->
      @observable.unregister payBannerObserver

    updateBannerStat:(status)->
      bannerStatus = 'status':status
      storage.save 'paymentBanner', bannerStatus
      @observable.notify status

    bannerExists:->
      utilities.existy(storage.get('paymentBanner'))

    getBannerStatus:->
      storage.get('paymentBanner').status


paymentBanner.$inject = ['Observer','utilities','storage']
module.exports =   paymentBanner