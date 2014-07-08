NavController = function($rootScope,$scope, $location, Auth,Utilities,Tracks,$cookies,Groups) {
    $scope.url= Utilities.originalGrockit().url;
    $scope.logOutUrl= Utilities.originalGrockit().url+'/logout';

    $rootScope.$on("init", function () {
        Application.init();
    });

    var Application = {
        loadGroupMembership: function(){
            if( $scope.currentUser.groupMemberships.length>0) {

                var groups = Groups.one();
                groups.customGET('', {subdomain: 'www'}).then(function (result) {
                    var response = result.data;

                    if ($scope.currentUser.studyingFor != null) {
                        var responseGroups = response.groups;

                        $scope.selectedGroup = Utilities.findInArray($scope.currentUser.studyingFor, responseGroups, 'id').name;
                        $scope.currentUser.groupName = $scope.selectedGroup;
                        var linkedGroups = $scope.groupMemberships;

                        angular.forEach(linkedGroups, function (val, index) {

                            if (linkedGroups[index] != null) {
                                var linkGroup = Utilities.findInArray(val.group_id, responseGroups, 'id');

                                if (angular.isDefined(linkGroup)) {
                                    $scope.linkedGroups.push(linkGroup);
                                    var indexToRemove = Utilities.getIndexArray(responseGroups, 'id', val.group_id);
                                    responseGroups.splice(indexToRemove, 1);

                                }

                            }

                        });
                        $scope.unLinkedGroups = responseGroups;
                    }

                }).catch(function error(msg) {
                    console.error(msg);
                });

            }

        },
        fetchLeftNavTracksData: function(){
            var tracks = Tracks.one();
            tracks.customGET('',{group_id : $scope.selectedGroup}).then(function(result){
                var response = result.data;
                $scope.tracksList = response.tracks;
            }).catch(function error(msg) {
                console.error(msg);
            });
        },
        init: function(){
            $scope.linkedGroups=[];
            $scope.unLinkedGroups=[];
            Auth.getUpdateUserData().then(function(response) {
                if(response!=null){
                    $scope.groupMemberships = response.groupMemberships;
                    $scope.currentUser = Auth.getCurrentUserInfo();
                    $scope.selectedGroup = Auth.getCurrentUserInfo().studyingFor;
                    Application.loadGroupMembership();
                    // fetchLeftNavTracksData();
                }
            });
        }
    };

    $scope.selectGroup = function(index){

        $scope.selectedGroup= $scope.linkedGroups[index].name;
        $scope.currentUser.groupName=$scope.selectedGroup;
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


    if(angular.isDefined($cookies.authorization_token)){
        if($cookies.authorization_token!=null || authorization_token.$cookies!=''){
            Application.init();
        }
    }


    function asd(){
        if( $scope.currentUser.groupMemberships.length>0){

            var groups = Groups.one();
            groups.customGET('',{subdomain : 'www'}).then(function(result){
                var responseGroups = result.data.groups;

                if(!!responseGroups) {

                  var studyingFor = !!$scope.currentUser.studyingFor ?
                                    Utilities.findInArray($scope.currentUser.studyingFor, responseGroups, 'id') :  $scope.groupMemberships[0];

                    $scope.selectedGroup = studyingFor.name;

                    $scope.currentUser.groupName = $scope.selectedGroup;
                    var linkedGroups = $scope.groupMemberships;

                    angular.forEach(linkedGroups, function (val, index) {

                        if (!!linkedGroups[index]) {
                            var linkGroup = Utilities.findInArray(val.group_id, responseGroups, 'id');

                            if (angular.isDefined(linkGroup)) {
                                $scope.linkedGroups.push(linkGroup);
                                var indexToRemove = Utilities.getIndexArray(responseGroups, 'id', val.group_id);
                                responseGroups.splice(indexToRemove, 1);
                            }
                        }
                    });
                    $scope.unLinkedGroups = responseGroups;
                }

            }).catch(function error(msg) {
                console.error(msg);
            });

        }
    }

};