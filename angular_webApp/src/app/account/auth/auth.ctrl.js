account.controller('NavController', ['$rootScope', '$scope', '$location', 'Auth','Utilities','Tracks','Groups', function($rootScope, $scope, $location, Auth,Utilities,Tracks,Groups) {

    $scope.init= function(){
        $scope.selected = -1;

        $scope.linkedGroups=[];
        $scope.unLinkedGroups=[];
        $scope.currentUser = Auth.getCurrentUserInfo();
        loadGroupMembership();
        fetchLeftNavTracksData();
    };

    $scope.selectGroup = function(index){
        $scope.selected = -1;
        $scope.selectedGroup= $scope.linkedGroups[index].name;
        $scope.currentUser.studyingFor=$scope.linkedGroups[index].group_id;
        Auth.updateUserInfo($scope.currentUser);
        window.test=$scope;
    };

    $scope.logOut= function(){
        Auth.logout();
    };

    $scope.select= function(index) {
        $scope.selected = index;
        if(index>=0) {
            var trackData = {'id': $scope.tracksList[index].id};
            Groups.setActiveTrack(trackData);
        }
    };

    function loadGroupMembership(){
        var  linkedGroups= $scope.currentUser.groupMemberships;
        Utilities.getJson('common/json/GroupMembership.json').then(function(result){
            $scope.selectedGroup= Utilities.findInArray($scope.currentUser.studyingFor,result,'group_id').name;

            angular.forEach(linkedGroups,function(val,index){

                if(val.group_id==result[index].group_id){
                    $scope.linkedGroups.push(result[index]);
                    result.splice(index, 1);
                }
            });
            $scope.unLinkedGroups=result;

        });


    }

    function fetchLeftNavTracksData(){
        var tracks = Tracks.one();
        tracks.customGET('',{group_id : 'gre',include_unpublished: true}).then(function(response){
            $scope.tracksList = response.tracks;
        }).catch(function error(msg) {
            console.error(msg);
        });
    }


    $scope.init();



}]);