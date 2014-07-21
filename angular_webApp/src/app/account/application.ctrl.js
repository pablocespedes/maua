NavController = function($rootScope,$scope, $location, Auth, Utilities, GrockitNewFeatures, ListenloopUtility, Tracks,$cookies,Groups,Alerts) {
    $scope.url= Utilities.originalGrockit().url;
    $scope.logOutUrl= Utilities.originalGrockit().url+'/logout';


    $rootScope.$on("init", function () {
        Application.init();
    });

    var Application = {
        loadGroupMembership: function(){
            if( $scope.currentUser.groupMemberships.length>0){

                Groups.getGroups().membershipGroups().then(function(result) {
                    var responseGroups = result.data.groups;

                    if (!!responseGroups) {

                        var studyingFor = Utilities.findInArray($scope.selectedGroup, responseGroups, 'id');

                        /*save the Group Name to rootScope*/
                        $rootScope.groupTitle = studyingFor.name;

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

                }).catch(function error(error) {

                    Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
                });
            }
            else{
                Alerts.showAlert('We are getting problems to find your subjects, if the problem persist please let\'s us know.','warning');

            }
        },
        fetchLeftNavTracksData: function(){
            Tracks.getTracks().allByGroup($scope.selectedGroup).then(function(result){
                var response = result.data;
                $scope.tracksList = response.tracks;

            }).catch(function error(error) {
                Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
            });
        },
        init: function(){
            $scope.linkedGroups=[];
            $scope.unLinkedGroups=[];
            Auth.getUpdateUserData().then(function(response) {
                if(response!=null){
                    $scope.currentUser = response;
                    $scope.groupMemberships = response.groupMemberships;
                    $scope.selectedGroup =  Utilities.getActiveGroup();
                    Application.loadGroupMembership();
                    GrockitNewFeatures.showDialog();
                    ListenloopUtility.base(response);
                }
            }).catch(function error(error) {
                Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
            });
        }
    };

    $scope.selectGroup = function(index){

        /*update group Name*/
        $rootScope.groupTitle= $scope.linkedGroups[index].name;

        $scope.currentUser.currentGroup=$scope.linkedGroups[index].id;
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
        if($cookies.authorization_token!=null || $cookies.authorization_token!=''){
            Application.init();
        }
    }

};