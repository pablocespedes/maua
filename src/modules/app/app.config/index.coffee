module.exports = angular.module('grockitApp.config', [])
.value('IntercomSettings', {})
.provider 'intercom', require('./providers/intercom.utilities')
.provider('ApiUrls', require('./apiurls'))
.value('fakeUserIntercom',
  email: 'john.doe@example.com'
  name: 'John Doe'
  created_at: 1234567890
  user_id: '9876')
.constant 'IntercomAppId', 'lfqlzjgt'
.constant 'userRoles',
  admin: 'admin'
  member: 'member'
  guest: 'guest'
.constant 'imgVersion',
  thumbnail: 'thumbnail'
  pinkyNail: 'pinkynail'
  original: 'original'
  large: 'large'
.constant 'urlsCons',
  localGrockit: 'http://localhost:8080/'
  liveGrockit: location.origin + '/2.0'
  oldGrockit: 'https://grockit.com'
  stagingGrockit: 'https://staging.grockit.com'
  ww2Grockit2: 'ww2.grockit.com'
  timingData: 'https://s3.amazonaws.com/go.grockit.com/2.0/data/'
  youtubeAPI: 'https://gdata.youtube.com/feeds/api/videos/'
  stagingAPI: 'https://api.staging.grockit.com'
  liveAPI: 'https://api.grockit.com'
.constant('userRoles',
  admin: 'admin'
  member: 'member'
  guest: 'guest')
.constant 'lifeCycle',
  inactive: 'inactive'
  freeTrialExpired: 'free_trial_expired'
  freeTrial: 'free_trial'
  active: 'active'
  questionLimit: 'question_limited_trial'
.constant 'appMessages',
  'freeTrialExp': 'There\'s <strong>no more</strong> time left in your trial.'
  'noGroups': 'We are getting problems to find your subjects,'+
  'if the problem persist please let\'s us know.'

.config(require('./config'))
.run(require('./run'))