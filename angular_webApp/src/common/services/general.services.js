angular.module('grockitApp.services', ['webStorageModule'])
    .factory('generalServices', function(webStorage) {
        return {
            isGroupActive: function () {
               var groupId= webStorage.get('groupId'),url='';
                if((groupId==null) ||(angular.isDefined(groupId))){
                    webStorage.add('groupId', 'sat');
                }

                return groupId;

            }
        }
});