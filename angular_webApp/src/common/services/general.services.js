angular.module('grockitApp.services', ['webStorageModule'])
    .factory('Utilities', function($http,webStorage,$rootScope,$location) {
        var trackData = {
                tracks:[],
                trackTitle:''
            };

        return {
            newGrockit: function(){
                return {
                    url : 'http://127.0.0.1:9000'//'https://staging.grockit.com/2.0'
                };
            },
            originalGrockit: function(){
                return {
                    url : 'https://staging.grockit.com'
                };
            },
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
           getIndexArray : function getArrayIndexForKey(arr, key, val){
               for(var i = 0; i < arr.length; i++){
                   if(arr[i][key] == val)
                       return i;
               }
               return -1;
           },
            encodeRedirect: function (redirectUrl, url) {
                var fUrl = redirectUrl + encodeURIComponent(url);
                window.location.href = fUrl;
            },
            redirect: function (url) {
                var basePath = $location.host=='127.0.0.1' || 'grockit.firstfactoryinc.com' ? '' : 'v2';
                window.location.href = basePath+url;
            },
            setActiveTab: function (position) {
                this.clearActiveTab();
                var menuList = angular.element('div#main-menu-inner ul.navigation li');
                angular.element(menuList[position]).addClass('active');

            },
            clearActiveTab: function () {
                angular.element('div#main-menu-inner ul.navigation li').removeClass('active');
            },
            hideFooter: function () {
                angular.element('footer').addClass('hide-footer')
            },
            showFooter: function () {
                angular.element('footer').removeClass('hide-footer')

            },
            dialogService: function(options){
                bootbox.dialog(options);
            }

        }
    });





