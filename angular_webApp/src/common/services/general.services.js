angular.module('grockitApp.services', ['webStorageModule'])
    .factory('Groups', function(webStorage,$rootScope) {
        var trackData = [];
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
                trackData=[];
                trackData.push(data);
            }

        }
    })
    .factory('Footer',function(){

        return{
            hideFooter: function () {
              angular.element('footer').addClass('hide-footer')
            },
            showFooter: function () {
                angular.element('footer').removeClass('hide-footer')

            }


        }
    })

.factory('Utilities', function($http) {
        var activeTabIndex=-1;
    return {
        findInArray: function (element,array,filter) {

            return  $.grep(array,function (val) {
                return val[filter] === element;
            })[0];
        },
        getJson: function (url) {
            return $http.get(url).then(function (response) {
                return response.data;
            }, function (error) {
                return "Error";
            });
        },
        encodeRedirect:function(redirectUrl,url){
            var fUrl=redirectUrl+ encodeURIComponent(url);
            window.location.href =fUrl;
        },
        redirect:function(url){
            window.location.href=url;
        },
        setActiveTab: function(){
            return activeTabIndex;
        },
        getActiveTab: function(index){
            activeTabIndex = index;
        }
    }
});





