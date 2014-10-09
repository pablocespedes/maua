'use strict';

angular.module("grockitApp.application",['webStorageModule'])
.constant('environmentCons', {
    localGrockit: 'http://127.0.0.1:9000/',
    liveGrockit: location.origin + '/2.0',
    oldGrockit: 'https://grockit.com',
    stagingGrockit: 'https://staging.grockit.com',
    ww2Grockit2:'ww2.grockit.com',
    timingData: 'https://s3.amazonaws.com/go.grockit.com/2.0/data/',
    youtubeAPI: 'https://gdata.youtube.com/feeds/api/videos/',
    stagingAPI: '//api.staging.grockit.com',
    liveAPI: 'https://api.grockit.com'
})
.constant('imageVersion',{
    thumbnail:'thumbnail',
    pinkyNail:'pinkynail',
    original:'original',
    large:'large'
});

