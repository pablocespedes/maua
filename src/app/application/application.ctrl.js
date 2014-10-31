/*IIFE: Wrap AngularJS components in an Immediately Invoked Function Expression (IIFE).It Avoid variable collisions*/
(function() {
  'use strict';
  angular
  .module('grockitApp.application')
  .controller('ApplicationController', ApplicationController);

  /*Manually injection will avoid any minification or injection problem*/
  ApplicationController.$inject = ['$scope','$location', 'Auth', 'utilities', 'ListenloopUtility',
  'GaUtility', 'InspectletUtility', 'GroupsApi', 'alerts', 'Headers', 'currentProduct','membershipService','menuService'
  ];

  function ApplicationController($scope,$location, Auth, utilities, ListenloopUtility,
    GaUtility, InspectletUtility, GroupsApi, alerts, Headers, currentProduct,membershipService,menuService) {
    /* jshint validthis: true */
    var vmApp = this;
    /* recommend: Using function declarations and bindable members up top.*/
    vmApp.isReady= false;
    vmApp.isActive = isActive;
    vmApp.url = utilities.originalGrockit().url;
    vmApp.logOutUrl = utilities.originalGrockit().url + '/logout';
    vmApp.selectGroup = selectGroup;
    vmApp.logOut = logOut;
    vmApp.groupRedirect = groupRedirect;


    function isActive(viewLocation) {
        return viewLocation === '/'+$location.path().split("/")[2];
    };

    function selectGroup(index) {

      /*update group Name*/
      utilities.setGroupTitle(vmApp.groups.linkedGroups[index].name);
      var currentGroupId = vmApp.groups.linkedGroups[index].id;
      currentProduct.currentGroupId(currentGroupId);

      Application.hideVideoOption(currentGroupId);
      Application.hideStudyPlan(currentGroupId);
    };

    function logOut() {
      Auth.logout();
    };

    function groupRedirect(id) {
      utilities.redirect(vmApp.url + '/' + id);
    }

    var Application = {
      hideVideoOption: function(groupId) {
        vmApp.hideVideoOption= (groupId === 'ap_calculus' ||
          groupId === 'ap_psychology' ||
          groupId === 'ap_us_history' ||
          groupId === 'ap_world_history' ||
          groupId === 'academy' ||
          groupId === 'iim-cat'
          );
      },
      hideStudyPlan: function(groupId) {
        vmApp.hideStudyPlan= (groupId === 'ap_psychology' ||
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

          GroupsApi.membershipGroups(false).then(function(result) {
            var responseGroups = result.data.groups;
            if (!!responseGroups) {

              var studyingFor = _.find(responseGroups, {
                'id': vmApp.activeGroupId
              });
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
          alerts.showAlert(appMessages.noGroupsFound, 'warning');

        }
      },
      init: function() {
        Auth.getCurrentUserInfo().then(function(response) {
          if (response != null) {
            vmApp.currentUser = response;
            currentProduct.observeGroupId().register(function(groupId) {
              vmApp.activeGroupId = groupId;

              vmApp.showBuyNow = membershipService.showBuyButton();
              vmApp.canAccess = membershipService.canPractice();
               var menuParams= {
                isReady: true,
                groupId:vmApp.activeGroupId
               };

               Application.hideVideoOption(vmApp.activeGroupId);
              Application.hideStudyPlan(vmApp.activeGroupId);
               vmApp.menu = menuService.createLeftMenu(menuParams,vmApp.hideStudyPlan,vmApp.hideVideoOption,vmApp.canAccess);

              Application.loadGroupMembership();
              ListenloopUtility.base(response);


            });

            GaUtility.classic();
            GaUtility.UA();
            InspectletUtility.base();

          }
        }).catch(function errorHandler(e) {
          alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
        });
      }
    };

    if (angular.isDefined(Headers.getCookie('authentication_token'))) {
      Headers.updateDefaultHeader();
      if (!!Headers.getCookie('authentication_token')) {
        Application.init();
      }
    }
  }
})();
