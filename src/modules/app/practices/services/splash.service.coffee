splashMessages = (utilities)->
  new class SplashMessages
    constructor: ->
      @loadingMessages = ['Spinning up the hamster...'
        'Shovelling coal into the server...'
        'Programming the flux capacitor'
        'Adjusting data for your IQ...'
        'Generating next funny line...'
        'Entertaining you while you wait...'
        'Improving your reading skills...'
        'Dividing eternity by zero, please be patient...'
        'Just stalling to simulate activity...'
        'Adding random changes to your data...'
        'Waiting for approval from Bill Gates...'
        'Adapting your practice questions...'
        'Supercharging your study...']
    getLoadingMessage : ->
      @loadingMessages[utilities.random(@loadingMessages.length - 1)]


splashMessages.$inject = ['utilities']
module.exports = splashMessages