angular.module('grockitApp.services', ['webStorageModule'])
    .factory('Utilities', function($http,webStorage,$rootScope,$location) {
           var trackData = {
                tracks:[],
                trackTitle:''
            },
            property='';

        function enviromentEvaluation(isNewGrockit){
            if(isNewGrockit){
               return location.host== '127.0.0.1:9000'  ? 'https://grockit.com' : location.origin+'/2.0';
            }
            else{
              return location.host== '127.0.0.1:9000' || location.host=='ww2.grockit.com' ? 'https://grockit.com' :location.origin
            }
        }

        return {
            newGrockit: function(){
                return {
                    url : enviromentEvaluation(true)
                };
            },
            originalGrockit: function(){
                return {
                    url : enviromentEvaluation(false)
                };
            },
            getActiveGroup: function(){
                $rootScope.activeGroupId = webStorage.get('currentUser').studyingFor;
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
            getIndexArray : function (arr, key, val){
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
            },
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
            isUndefinedNull : function(val) {
                return angular.isUndefined(val) || val === null || val==''
            }

        }
    });





