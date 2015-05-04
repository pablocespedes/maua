runConfig = (intercom,fakeUserIntercom)->
  console.log intercom
  intercom.boot fakeUserIntercom


runConfig.$inject = ['intercom','fakeUserIntercom']
module.exports = runConfig