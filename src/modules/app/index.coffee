'use strict'

module.exports = angular.module('grockitApp', [
  'ui.router'
  'restangular',
  'ngMessages'
  require('../../../tmp/templates').name
  require('./account/register/index').name
  require('./account/login/index').name
  require('./application/index').name
  require('./dashboard/index').name
])
.constant("environmentCons",
  localGrockit: "http://127.0.0.1:9000/"
  liveGrockit: location.origin + "/2.0"
  oldGrockit: "https://grockit.com"
  stagingGrockit: "https://staging.grockit.com"
  ww2Grockit2: "ww2.grockit.com"
  timingData: "https://s3.amazonaws.com/go.grockit.com/2.0/data/"
  youtubeAPI: "https://gdata.youtube.com/feeds/api/videos/"
  stagingAPI: "https://api.staging.grockit.com"
  liveAPI: "https://api.grockit.com"
).constant "imageVersion",
  thumbnail: "thumbnail"
  pinkyNail: "pinkynail"
  original: "original"
  large: "large"
.config(require('./index.config'))
