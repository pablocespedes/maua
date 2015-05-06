runConfig = (intercom,fakeUserIntercom)->
  intercom.boot fakeUserIntercom

runConfig.$inject = ['intercom','fakeUserIntercom']
module.exports = runConfig