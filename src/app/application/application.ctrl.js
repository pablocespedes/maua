(function() {
  'use strict';
  angular
  .module('grockitApp.application')
  .controller('ApplicationController', ApplicationController);

  /*Manually injection will avoid any minification or injection problem*/
  ApplicationController.$inject = ['$scope', '$location', '$route', 'Auth', 'utilities', 'grockitNewFeatures', 'ListenloopUtility',
  'GaUtility', 'InspectletUtility', 'Tracks', 'Groups', 'alerts', 'Headers', 'setCurrentProduct'
  ];

  function ApplicationController($scope, $location, $route, Auth, utilities, grockitNewFeatures, ListenloopUtility,
    GaUtility, InspectletUtility, Tracks, Groups, alerts, Headers, setCurrentProduct) {
    /* jshint validthis: true */
    var vmApp = this;
    /* recommend: Using function declarations and bindable members up top.*/

    vmApp.url = utilities.originalGrockit().url;
    vmApp.logOutUrl = utilities.originalGrockit().url + '/logout';
    vmApp.showDialog = showDialog;
    vmApp.selectGroup = selectGroup;
    vmApp.logOut = logOut;
    vmApp.select = select;
    vmApp.groupRedirect = groupRedirect;

    function showDialog() {
      grockitNewFeatures.showDialog();
    };

    function selectGroup(index) {

      /*update group Name*/
      utilities.setGroupTitle(vmApp.groups.linkedGroups[index].name);

      vmApp.currentUser.currentGroup = vmApp.groups.linkedGroups[index].id;

      Auth.updateUserInfo(vmApp.currentUser);
      vmApp.activeGroupId = utilities.getActiveGroup();
      Application.hideVideoOption(vmApp.activeGroupId);
      Application.hideStudyPlan(vmApp.activeGroupId);
    };

    function logOut() {
      Auth.logout();
    };

    function select(index) {

      if (angular.isDefined(index)) {

        if (index >= 0) {

          utilities.clearActiveTab();
          $scope.selected = index;

          var tracks = [];
          tracks.push($scope.tracksList[index].id);

          var trackData = {
            'id': $scope.tracksList[index].id,
            tracks: tracks,
            trackTitle: $scope.tracksList[index].name
          };
          utilities.setActiveTrack(trackData);

          $route.reload();

        }

      }
    };

    function groupRedirect(id) {
      utilities.redirect(vmApp.url + '/' + id);
    }

    var Application = {
      hideVideoOption: function(groupId) {
        vmApp.videoLibHide = (groupId === 'ap_calculus' ||
          groupId === 'ap_psychology' ||
          groupId === 'ap_us_history' ||
          groupId === 'ap_world_history' ||
          groupId === 'academy' ||
          groupId === 'iim-cat'
          );
      },
      hideStudyPlan: function(groupId) {
        vmApp.studyPlanHide = (groupId === 'ap_psychology' ||
          groupId === 'ap_world_history' ||
          groupId === 'gre' ||
          groupId === 'lsat' ||
          groupId === 'iim-cat'
          );
      },
      loadGroupMembership: function() {
        vmApp.groups = {
          linkedGroups: [],
          unLinkedGroups: []
        };

        if (vmApp.currentUser.groupMemberships.length > 0) {

          Groups.getGroups().membershipGroups(true).then(function(result) {
            var responseGroups = result.data.groups;
            if (!!responseGroups) {

              var studyingFor = _.find(responseGroups, { 'id': vmApp.activeGroupId });
              if (angular.isDefined(studyingFor)) {
                utilities.setGroupTitle(studyingFor.name);
              }

              var linkedGroups = vmApp.currentUser.groupMemberships,
              len = linkedGroups.length,
              i;

              for (i = 0; i < len; i++) {
                var lG = linkedGroups[i];
                if (!!lG) {
                  var linkGroupFilter = {
                    'id': lG.group_id
                  },
                  linkGroup = _.find(responseGroups, linkGroupFilter);

                  if (angular.isDefined(linkGroup)) {
                    vmApp.groups.linkedGroups.push(linkGroup);
                    var indexToRemove = utilities.getIndexArray(responseGroups, 'id', lG.group_id);
                    responseGroups.splice(indexToRemove, 1);
                  }
                }
              }
              vmApp.groups.unLinkedGroups = responseGroups;
            }

          }).catch(function errorHandler(e) {

            alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
          });
        } else {
          alerts.showAlert('We are getting problems to find your subjects, if the problem persist please let\'s us know.', 'warning');

        }
      },
      fetchLeftNavTracksData: function() {
        vmApp.tracksList = [];
        Tracks.getTracks().allByGroup(vmApp.activeGroupId).then(function(result) {
          var response = result.data;
          vmApp.tracksList = response.tracks;

        }).catch(function errorHandler(e) {
          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      },
      init: function() {
        Auth.getCurrentUserInfo().then(function(response) {
          if (response != null) {
            vmApp.currentUser = response;

            vmApp.activeGroupId = response.currentGroup;
            setCurrentProduct.currentGroupId(vmApp.activeGroupId);

            Application.hideVideoOption(vmApp.activeGroupId);
            Application.hideStudyPlan(vmApp.activeGroupId);
            Application.loadGroupMembership();
            ListenloopUtility.base(response);
            GaUtility.classic();
            GaUtility.UA();
            InspectletUtility.base();
          }
        }).catch(function errorHandler(e) {
          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      }
    };

    $scope.$watch(function() {
      return setCurrentProduct.groupId;
    },
    function(newVal, oldVal) {
      vmApp.activeGroupId = newVal;
    });

    if (angular.isDefined(Headers.getCookie('authentication_token'))) {
      Headers.updateDefaultHeader();
      if (!!Headers.getCookie('authentication_token')) {
        Application.init();
      }
    }
  }
})();
