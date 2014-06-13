angular.module('grockitApp.services', ['webStorageModule'])
    .provider('url.provider',function(){
        this.$get= function(){
            var obj={};
            obj.other= function(){return '/:subject/dashboard-practice'};
        }
    })
    .factory('generalServices', function(webStorage,$rootScope) {
        return {
            isGroupActive: function () {
                var groupId= webStorage.get('groupId');
                if((groupId==null) ||(angular.isDefined(groupId))){
                    webStorage.add('groupId', 'sat');
                }

                return groupId;
            },
            getActiveGroup: function(){
                return  $rootScope.activeGroupId;
            }

        }
    }).
    config(["url.providerProvider",function(p){

    }]);

