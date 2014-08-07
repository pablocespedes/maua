NavController = function($rootScope,$scope, $location, Auth, Utilities, GrockitNewFeatures, ListenloopUtility, GaUtility, Tracks,$cookies,Groups,Alerts,$route,Headers) {
  $scope.url = Utilities.originalGrockit().url;
  $scope.logOutUrl = Utilities.originalGrockit().url + '/logout';


  var Application = {
    loadGroupMembership: function () {
      $scope.groups = {
        linkedGroups: [],
        unLinkedGroups: []
      };

      if ($scope.currentUser.groupMemberships.length > 0) {

        Groups.getGroups().membershipGroups().then(function (result) {
          var responseGroups = result.data.groups;

          if (!!responseGroups) {

            var studyingFor = Utilities.findInArray($scope.activeGroupId, responseGroups, 'id');

            /*save the Group Name to rootScope*/
            $rootScope.groupTitle = studyingFor.name;

            var linkedGroups = $scope.currentUser.groupMemberships;

            angular.forEach(linkedGroups, function (val, index) {

              if (!!linkedGroups[index]) {
                var linkGroup = Utilities.findInArray(val.group_id, responseGroups, 'id');

                if (angular.isDefined(linkGroup)) {
                  $scope.groups.linkedGroups.push(linkGroup);
                  var indexToRemove = Utilities.getIndexArray(responseGroups, 'id', val.group_id);
                  responseGroups.splice(indexToRemove, 1);
                }
              }
            });
            $scope.groups.unLinkedGroups = responseGroups;
          }

        }).catch(function error(error) {

          Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
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

      }).catch(function error(error) {
        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
      });
    },
    init: function () {
      Auth.getCurrentUserInfo().then(function (response) {
        if (response != null) {
          $scope.currentUser = response;

          $scope.activeGroupId = response.currentGroup;
          Application.loadGroupMembership();
          ListenloopUtility.base(response);
          GaUtility.classic();
          GaUtility.UA();
        }
      }).catch(function error(error) {
        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
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
    // Application.fetchLeftNavTracksData();
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
