(function() {
  'use strict';

  angular.module("grockitApp.application")
    .factory('grockitModal', grockitModal)
    .service('currentProduct', currentProduct)
    .factory('appService', appService)
    .factory('menuService', menuService)
    .service('setItUpUserProgress', setItUpUserProgress)
    .service('setItUpScorePrediction', setItUpScorePrediction);

  grockitModal.$inject = ['$http', 'utilities', 'environmentCons'];
  currentProduct.$inject = ['webStorage', 'Observable', 'utilities'];
  appService.$inject = ['$window', '$q', '$location', 'Auth', 'GroupsApi', 'utilities', 'membershipService', 'currentProduct', 'alerts'];
  menuService.$inject = ['utilities'];
  setItUpUserProgress.$inject = ['Observable'];
  setItUpScorePrediction.$inject = ['Observable'];

  function grockitModal($http, utilities, environmentCons) {

    var service = {
      showTrialExpiration: showTrialExpiration
    };
    return service;

    function showTrialExpiration(titleM, groupId, nQuestions) {
      var msg = 'Looks like you\'ve been pretty busy these past few days. You\'ve answered ' +
        +nQuestions + ' questions and are well on your way to Grocking the ' + utilities.getGroupTitle() + '!';
      var dialogOptions = {
        title: '<i class="fa fa-clock-o"></i> Time to upgrade!',
        animate: true,
        message: '<div class="text-lg trial text-center">' + msg +
          '<br><br>Keep Grocking the ' + utilities.getGroupTitle() + '. Starting at just $9.<div>',
        className: "modal-trial modal-success",
        buttons: {
          success: {
            label: 'Continue using Grockit.',
            className: 'btn-success',
            callback: function() {
              var baseUrl = utilities.originalGrockit(false).url;
              utilities.redirect(baseUrl + '/' + groupId + '/subscriptions/new');
            }
          },
        }
      };

      utilities.dialogService(dialogOptions);
    }
  }

  function currentProduct(webStorage, Observable, utilities) {
    var currentUser = webStorage.get('currentUser'),
      observable = Observable.create('currentProduct');

    this.currentGroupId = function(groupId, actualGroup) {
      if (currentUser !== null && groupId !== currentUser.currentGroup) {
        currentUser.currentGroup = groupId;
        webStorage.add('currentUser', currentUser);
      }
      utilities.setGroupTitle(actualGroup.name)
      observable.notify(groupId);
    };

    this.observeGroupId = function() {
      return Observable.get('currentProduct');
    }

    this.unregisterGroup = function(groupObserver) {
      observable.unregister(groupObserver);
    }
  }

  function appService($window, $q, $location, Auth, GroupsApi, utilities, membershipService, currentProduct, alerts) {


    var _appFn = {
      actualGroup: function(groups, urlGroup) {
        return _.find(groups, {
          'id': urlGroup
        })
      },
      userGroup: function(gMembership, urlGroup) {
        return _.find(gMembership, {
          'group_id': urlGroup
        })
      },
      isBasePath: function(userResponse) {
        return ($location.path() === '/' || $location.path() === '/' + userResponse.currentGroup || $location.path() == '');
      },
      getUserData: function() {
        var userData = Auth.getUpdateUserData(),
          userMembership = GroupsApi.membershipGroups(true);

        return $q.all([userData]);
      }
    };

    var service = {
      userPreflight: userPreflight
    };

    return service;


    function userPreflight(event) {
      if (Auth.isLoggedIn()) {

        _appFn.getUserData()
          .then(getUserDataCompleted)
          .catch(getUserDataFailed);

      } else {
        $("body").html('The user is not logged in! <a href=\"/logout\">Click here to restart</a>.');
        event.preventDefault();
      }


      function getUserDataCompleted(response) {
        var userResponse = response[0];

        if (userResponse != null) {
          GroupsApi.membershipGroups(true).then(function(groupsResult) {
            var groups = groupsResult.data.groups;
            if (_appFn.isBasePath(userResponse)) {

              utilities.internalRedirect('/' + userResponse.currentGroup + '/dashboard');

            } else {

              var userGroup = _appFn.userGroup(userResponse.groupMemberships, utilities.getCurrentParam('subject')),
                urlGroup = angular.isUndefined(userGroup) ? userResponse.groupMemberships[0].group_id :
                utilities.getCurrentParam('subject'),
                availableGroup = _appFn.userGroup(userResponse.groupMemberships, urlGroup),
                actualGroup = _appFn.actualGroup(groups, urlGroup);
              if (angular.isUndefined(userGroup)) {
                utilities.internalRedirect('/' + urlGroup + '/dashboard')
              }
              if (angular.isUndefined(actualGroup)) {

                $window.location = '404.html';

              } else {
                membershipService.setMembershipInfo(userResponse, availableGroup, urlGroup);
                membershipService.userCanAccesPage(urlGroup);
                currentProduct.currentGroupId(urlGroup, actualGroup);

              }
            }
          });

        }
      }

      function getUserDataFailed(e) {
        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
      }

    }
  }

  function menuService(utilities) {
    var grockitTV = 'http://grockit.tv/',
      baseUrl = utilities.originalGrockit().url;

    var service = {
      createLeftMenu: createLeftMenu
    };
    return service;

    function createLeftMenu(options, hideStudyPlan, hideVideoOption, canAccess) {

      return [{
          id: 'dashboard',
          url: '#/' + options.groupId + '/dashboard/',
          canAccess: canAccess,
          title: 'Dashboard',
          isReady: options.isReady,
          iconclass: 'fa-dashboard',
          shouldShow: true

        }, {
          id: 'study_plan',
          url: baseUrl + '/' + options.groupId + '/study_plan',
          canAccess: canAccess,
          title: 'Study Plan',
          isReady: options.isReady,
          iconclass: 'fa-tasks',
          shouldShow: (!hideStudyPlan)
        }, {
          id: 'social',
          url: baseUrl + '/' + options.groupId + '/social',
          canAccess: canAccess,
          title: 'Group Practice',
          isReady: options.isReady,
          iconclass: 'fa-users',
          shouldShow: (options.groupId != 'gre')
        }, {
          id: 'video_courses',
          url: baseUrl + '/' + options.groupId + '/video_courses',
          canAccess: canAccess,
          title: 'Video Library',
          isReady: options.isReady,
          iconclass: 'fa-video-camera',
          shouldShow: (!hideVideoOption)
        }, {
          id: 'custom_practice',
          url: baseUrl + '/' + options.groupId + '/custom_games/new',
          canAccess: canAccess,
          title: 'Custom Practice',
          isReady: options.isReady,
          iconclass: 'fa-book',
          shouldShow: (options.groupId != 'gre')
        }, {
          id: 'gre_fullLenghtTest',
          url: grockitTV + 'grepracticetest',
          canAccess: canAccess,
          title: 'Take a Full Length Test',
          isReady: options.isReady,
          iconclass: 'fa-lightbulb-o',
          shouldShow: (options.groupId === 'gre')
        }, {
          id: 'gmat_fullLenghtTest',
          url: baseUrl + '/' + options.groupId + '/join_cat_game',
          canAccess: canAccess,
          title: 'Take a Full Length Test',
          isReady: options.isReady,
          iconclass: 'fa-lightbulb-o',
          shouldShow: (options.groupId === 'gmat')
        }, {
          id: 'tutoring',
          url: baseUrl + '/' + options.groupId + '/tutoring',
          canAccess: canAccess,
          title: 'Tutoring',
          isReady: options.isReady,
          iconclass: 'fa-briefcase',
          shouldShow: true
        }, {
          id: 'skill_data',
          url: baseUrl + '/' + options.groupId + '/skill_data',
          canAccess: canAccess,
          title: 'Skill Data',
          isReady: options.isReady,
          iconclass: 'fa-dashboard',
          shouldShow: true
        }, {
          id: 'history',
          url: '#/' + options.groupId + '/history/',
          canAccess: canAccess,
          title: 'History',
          isReady: options.isReady,
          iconclass: 'fa-bar-chart-o',
          shouldShow: (options.groupId === 'gre')
        }, {
          id: 'history',
          url: baseUrl + '/' + options.groupId + '/reviews',
          canAccess: canAccess,
          title: 'History',
          isReady: options.isReady,
          iconclass: 'fa-bar-chart-o',
          shouldShow: (options.groupId !== 'gre')
        },

      ];
    }
  }

  function setItUpUserProgress(Observable) {
    var observable = Observable.create('userProgress');

    this.setUserProgress = function(userProgressData) {
      observable.notify(userProgressData);
    };
    this.observeUserProgress = function() {
      return Observable.get('userProgress');
    }
  }

  function setItUpScorePrediction(Observable) {
    var observableScore = Observable.create('scorePrediction');

    this.setScorePrediction = function(scorePredictionData) {
      observableScore.notify(scorePredictionData);
    };
    this.observeScorePrediction = function() {
      return Observable.get('scorePrediction');
    }
  }


})();
