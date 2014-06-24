angular.module('grockitApp.services', ['webStorageModule'])
    .factory('Utilities', function($http,webStorage,$rootScope) {
        var activeTabIndex=-1;
        var trackData = {
                tracks:[],
                trackTitle:''
            };

        return {
            getActiveGroup: function(){
                $rootScope.activeGroupId =  webStorage.get('currentUser').studyingFor;
                return  $rootScope.activeGroupId;
            },
            setActiveGroup: function(activeGroupId){
                $rootScope.activeGroupId = activeGroupId;
            },
            getActiveTrack: function () {
                return trackData;
            },
            setActiveTrack: function (data) {
                trackData=data;
            },
            findInArray: function (element, array, filter) {
                return  $.grep(array, function (val) {
                    return val[filter] == element;
                })[0];
            },
            encodeRedirect: function (redirectUrl, url) {
                var fUrl = redirectUrl + encodeURIComponent(url);
                window.location.href = fUrl;
            },
            redirect: function (url) {
                window.location.href = url;
            },
            setActiveTab: function () {
                return activeTabIndex;
            },
            getActiveTab: function (index) {
                activeTabIndex = index;
            },
            hideFooter: function () {
                angular.element('footer').addClass('hide-footer')
            },
            showFooter: function () {
                angular.element('footer').removeClass('hide-footer')

            }
        }
    });





