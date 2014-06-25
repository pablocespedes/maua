NavController = function($rootScope,$scope, $location, Auth,Utilities,Tracks,$cookies,Groups) {

    $rootScope.$on("init", function () {
        init();
    });

    $scope.selectGroup = function(index){

        $scope.selectedGroup= $scope.linkedGroups[index].name;
        $scope.currentUser.studyingFor=$scope.linkedGroups[index].id;
        Auth.updateUserInfo($scope.currentUser);
    };

    $scope.logOut= function(){
        Auth.logout();
    };

    $scope.select= function(index) {
        Utilities.clearActiveTab();
        $scope.selected = index;

        if(index>=0) {
            var trackData = {'id': $scope.tracksList[index].id};
            Utilities.setActiveTrack(trackData);
        }
    };

    function loadGroupMembership(){

        if( $scope.currentUser.groupMemberships.length>0){

            var groups = Groups.one();
            groups.customGET('',{subdomain : 'www'}).then(function(result){
                var response = result.data;

                if($scope.currentUser.studyingFor!=null){
                    var responseGroups= response.groups,groupsUnLinked=response.groups;

                    $scope.selectedGroup= Utilities.findInArray($scope.currentUser.studyingFor,responseGroups,'id').name;
                    var  linkedGroups= $scope.groupMemberships;

                    angular.forEach(linkedGroups,function(val,index){

                        if(linkedGroups[index]!=null) {
                            var linkGroup = Utilities.findInArray(val.group_id, responseGroups, 'id');

                            if(angular.isDefined(linkGroup)){
                                $scope.linkedGroups.push(linkGroup);
                                var indexToRemove = Utilities.getIndexArray(responseGroups,'id',val.group_id);
                                responseGroups.splice(indexToRemove, 1);

                            }

                        }

                    });
                    $scope.unLinkedGroups=responseGroups;
                }

            }).catch(function error(msg) {
                console.error(msg);
            });

        }

    }

    function init(){

        $scope.linkedGroups=[];
        $scope.unLinkedGroups=[];
        Auth.getUpdateUserData().then(function(response) {
            if(response!=null){
                $scope.groupMemberships = response.groupMemberships;
                $scope.currentUser = Auth.getCurrentUserInfo();
                $scope.selectedGroup = Auth.getCurrentUserInfo().studyingFor;
                loadGroupMembership();
                fetchLeftNavTracksData();
            }
        });
    }

    if(angular.isDefined($cookies.authorization_token)){
        if($cookies.authorization_token!=null || authorization_token.$cookies!=''){
            init();
        }
    }



    function fetchLeftNavTracksData(){
        var tracks = Tracks.one();
        tracks.customGET('',{group_id : $scope.selectedGroup}).then(function(result){
             var response = result.data;
            $scope.tracksList = response.tracks;
        }).catch(function error(msg) {
            console.error(msg);
        });
    }






};