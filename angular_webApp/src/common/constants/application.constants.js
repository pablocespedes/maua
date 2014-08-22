angular.module('grockitApp.constants', [])
.constant('UserRoles', {
    admin: 'admin',
    member: 'member',
    guest: 'guest'
})
.constant('environmentCons', {
    localGrockit: 'http://127.0.0.1:9000/',
    liveGrockit: location.origin + '/2.0',
    oldGrockit: 'https://grockit.com',
    stagingGrockit: 'https://staging.grockit.com',
    ww2Grockit2:'ww2.grockit.com',
    timingData: 'https://s3.amazonaws.com/go.grockit.com/2.0/data/',
    youtubeAPI: 'https://gdata.youtube.com/feeds/api/videos/',
    stagingAPI: 'http://api.staging.grockit.com',
    liveAPI: 'https://api.grockit.com'
});
