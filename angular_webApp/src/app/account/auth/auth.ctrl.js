account.controller('NavController', ['$rootScope', '$scope', '$location', 'Auth','Utilities','Tracks','Groups', function($rootScope, $scope, $location, Auth,Utilities,Tracks,Groups) {

    $scope.init= function(){
        $scope.selected = Utilities.getActiveTab();

        $scope.linkedGroups=[];
        $scope.unLinkedGroups=[];
        Auth.getUpdateUserData().then(function(response) {
            $scope.groupMemberships = response.groupMemberships;
            $scope.currentUser = Auth.getCurrentUserInfo();
            $scope.selectedGroup = Auth.getCurrentUserInfo().studyingFor;
            loadGroupMembership();
            //  fetchLeftNavTracksData();
        });



    };

    $scope.selectGroup = function(index){

        $scope.selectedGroup= $scope.linkedGroups[index].name;
        $scope.currentUser.studyingFor=$scope.linkedGroups[index].group_id;
        Auth.updateUserInfo($scope.currentUser);
    };

    $scope.logOut= function(){
        Auth.logout();
    };

    $scope.select= function(index) {
        $scope.selected = index;
        Utilities.setActiveTab(index);
        if(index>=0) {
            var trackData = {'id': $scope.tracksList[index].id};
            Groups.setActiveTrack(trackData);
        }
    };

    function loadGroupMembership(){

        if( $scope.currentUser.groupMemberships.length>0){

            Utilities.getJson('common/json/GroupMembership.json').then(function(result){

                $scope.selectedGroup= Utilities.findInArray($scope.currentUser.studyingFor,result,'group_id').name;
                var  linkedGroups= $scope.groupMemberships;

                angular.forEach(linkedGroups,function(val,index){

                    if(linkedGroups[index]!=null) {
                        $scope.linkedGroups.push(Utilities.findInArray(val.group_id, result, 'group_id'))
                        result.splice(index, 1);
                    }

                });
                $scope.unLinkedGroups=result;


            });
        }

    }

    function fetchLeftNavTracksData(){
        var tracks = Tracks.one();
        tracks.customGET('',{group_id : $scope.selectedGroup,include_unpublished: true}).then(function(response){

            $scope.tracksList = response.tracks;
            window.test = response.tracks;
        }).catch(function error(msg) {
            console.error(msg);
        });
    }


    $scope.init();



}]);