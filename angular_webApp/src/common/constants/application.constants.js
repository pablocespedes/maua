angular.module('grockitApp.constants', [])

.constant('environmentCons', {
    localGrockit: 'http://127.0.0.1:9000/',
    liveGrockit: location.origin + '/2.0',
    timingData: 'https://s3.amazonaws.com/go.grockit.com/2.0/data/',
    youtubeAPI: 'https://gdata.youtube.com/feeds/api/videos/',
    stagingAPI: 'http://api.staging.grockit.com',
    liveAPI: 'https://api.grockit.com'
});
