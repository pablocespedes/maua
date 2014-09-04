NavController = function ($rootScope, $scope, $location, Auth, Utilities, GrockitNewFeatures, ListenloopUtility, GaUtility, Tracks, $cookies, Groups, Alerts, $route, Headers) {
  $scope.url = Utilities.originalGrockit().url;
  $scope.logOutUrl = Utilities.originalGrockit().url + '/logout';


  var Application = {
    hideVideoOption : function(groupId){
      $scope.videoLibHide = (groupId === 'ap_calculus' ||
        groupId === 'ap_psychology' ||
        groupId === 'ap_us_history' ||
        groupId === 'ap_world_history'||
        groupId === 'academy' ||
        groupId === 'iim-cat'
        );
    },
    hideStudyPlan: function(groupId){
      $scope.studyPlanHide = (groupId === 'ap_psychology' ||
        groupId === 'ap_world_history'||
        groupId === 'gre' ||
        groupId === 'lsat' ||
        groupId === 'iim-cat'
        );

    },
    loadGroupMembership: function () {
      $scope.groups = {
        linkedGroups: [],
        unLinkedGroups: []
      };

      if ($scope.currentUser.groupMemberships.length > 0) {

        Groups.getGroups().membershipGroups().then(function (result) {
          var responseGroups = result.data.groups;

          if (!!responseGroups) {

            var objFilter = {'id': $scope.activeGroupId},
              studyingFor = Utilities.findInCollection(responseGroups, objFilter);
            if(angular.isDefined(studyingFor)){
              /*save the Group Name to rootScope*/
              $rootScope.groupTitle = studyingFor.name;
            }
            var linkedGroups = $scope.currentUser.groupMemberships,len = linkedGroups.length,i;

            for (i = 0; i < len; i++) {
              var lG = linkedGroups[i];
              if (!!lG) {
                var linkGroupFilter = {'id': lG.group_id},
                  linkGroup = Utilities.findInCollection(responseGroups, linkGroupFilter);

                if (angular.isDefined(linkGroup)) {
                  $scope.groups.linkedGroups.push(linkGroup);
                  var indexToRemove = Utilities.getIndexArray(responseGroups, 'id', lG.group_id);
                  responseGroups.splice(indexToRemove, 1);
                }
              }
            }
            $scope.groups.unLinkedGroups = responseGroups;
          }

        }).catch(function errorHandler(e) {

          Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
        });
      }
      else {
        Alerts.showAlert('We are getting problems to find your subjects, if the problem persist please let\'s us know.', 'warning');

      }
    },
    fetchLeftNavTracksData: function () {
      $scope.tracksList = [];
      Tracks.getTracks().allByGroup($scope.activeGroupId).then(function (result) {
        var response = result.data;
        $scope.tracksList = response.tracks;

      }).catch(function errorHandler(e) {
        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });
    },
    init: function () {
      Auth.getCurrentUserInfo().then(function (response) {
        if (response != null) {
          $scope.currentUser = response;

          $scope.activeGroupId = response.currentGroup;

          Application.hideVideoOption($scope.activeGroupId);
          Application.hideStudyPlan($scope.activeGroupId);
          Application.loadGroupMembership();
          //Application.fetchLeftNavTracksData();
          ListenloopUtility.base(response);
          GaUtility.classic();
          GaUtility.UA();
        }
      }).catch(function errorHandler(e) {
        Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
      });
    }
  };

  $scope.showDialog = function () {
    GrockitNewFeatures.showDialog();
  };

  $scope.selectGroup = function (index) {

    /*update group Name*/
    $rootScope.groupTitle = $scope.groups.linkedGroups[index].name;

    $scope.currentUser.currentGroup = $scope.groups.linkedGroups[index].id;

    Auth.updateUserInfo($scope.currentUser);
    $scope.activeGroupId = Utilities.getActiveGroup();
    Application.hideVideoOption($scope.activeGroupId);
    Application.hideStudyPlan($scope.activeGroupId);
  };

  $scope.logOut = function () {
    Auth.logout();
  };

  $scope.select = function (index) {

    if (angular.isDefined(index)) {

      if (index >= 0) {

        Utilities.clearActiveTab();
        $scope.selected = index;

        var tracks = [];
        tracks.push($scope.tracksList[index].id);

        var trackData = {
          'id': $scope.tracksList[index].id,
          tracks: tracks,
          trackTitle: $scope.tracksList[index].name
        };
        Utilities.setActiveTrack(trackData);

        $route.reload();

      }

    }

  };

  if (angular.isDefined(Headers.getCookie('authentication_token'))) {
    Headers.updateDefaultHeader();
    if (!!Headers.getCookie('authentication_token')) {
      Application.init();
    }
    else {
      Alerts.showAlert('Permission Denied..', 'danger');
      //send to login page
    }
  }

};
