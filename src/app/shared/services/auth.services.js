(function() {
  'use strict';

  angular
  .module("grockitApp.authServices", ['webStorageModule'])
  .constant('UserRoles', {
    admin: 'admin',
    member: 'member',
    guest: 'guest'
  }).
  constant('lifeCycle', {
  inactive:'inactive',
  freeTrialExpired:'free_trial_expired',
  freeTrial:'free_trial',
  active:'active'
  })
  .factory('Auth', Auth)
  .service('membershipService', membershipService);

  Auth.$inject = ['$window', '$cookies', '$cookieStore', 'UserRoles', 'webStorage', 'UsersApi', 'utilities', '$location', '$q', 'Headers', 'imageVersion'];
  membershipService.$inject = ['dateUtils', 'grockitModal', 'appMessages', '$location','utilities','lifeCycle'];

  function Auth($window, $cookies, $cookieStore, UserRoles, webStorage, UsersApi, utilities, $location, $q, Headers, imageVersion) {

    function defaultGroup(user) {
      return user != null && angular.isDefined(user.currentGroup) ? user.currentGroup : undefined;
    }

    var setUserData = function(response) {
      var user = webStorage.get('currentUser'),
      currentUser = {
        userId: response.id,
        role: response.guest ? UserRoles.guest : UserRoles.member,
        groupMemberships: response.group_memberships,
        currentGroup: angular.isDefined(defaultGroup(user)) ? defaultGroup(user) : response.group_memberships[0].group_id,
        firstName: response.first_name,
        fullName: response.full_name,
        avatarUrl: angular.isDefined(response.avatar_url) || response.avatar_url !== null ?
        response.avatar_url.replace('version', imageVersion.thumbnail) : 'images/avatar.png',
        emailAddress: response.email_address,
        becamePremiumAt: response.became_premium_at
      };

      webStorage.add('currentUser', currentUser);
      return currentUser;
    },
    updateUserPromise = null;

    var service = {
      isLoggedIn: isLoggedIn,
      logout: logout,
      getCurrentUserInfo: getCurrentUserInfo,
      getUpdateUserData: getUpdateUserData,
      updateUserInfo: updateUserInfo
    }
    return service;

    function isLoggedIn() {
      return (!!$cookies["authentication_token"]);
    };

    function logout() {
      var logOut = utilities.originalGrockit().url + '/logout';
      webStorage.remove('currentUser');
      $cookieStore.remove('authentication_token');
      $window.location.href = logOut;
    };

    function getCurrentUserInfo() {
      var deferred = $q.defer();

      var currentUser = webStorage.get('currentUser');

      if (currentUser) {
        currentUser.currentGroup = defaultGroup(currentUser);
        webStorage.add('currentUser', currentUser);
        deferred.resolve(currentUser);
      } else {
        if (updateUserPromise !== null) {
          deferred = updateUserPromise;
        } else {
          UsersApi.self().then(function(result) {
            var userData = setUserData(result.data.user);
            deferred.resolve(userData);
          }).catch(function error(e) {
            deferred.resolve(webStorage.get('currentUser'));
          });
        }


      }
      return deferred.promise;
    };

    function getUpdateUserData() {
      updateUserPromise = $q.defer();
      Headers.updateDefaultHeader();
      UsersApi.self().then(function(result) {
        var userData = setUserData(result.data.user);
        updateUserPromise.resolve(userData);
      }).catch(function errorHandler(e) {
        updateUserPromise.resolve(webStorage.get('currentUser'));
      });

      return updateUserPromise.promise;
    };

    function updateUserInfo(currentUser) {
      webStorage.add('currentUser', currentUser);
    }
  }


  function membershipService(dateUtils, grockitModal, appMessages, $location,utilities,lifeCycle) {
    var membershipInfo = {},
    _membershipFn = {
      isPremium: function() {
        return (membershipInfo.becamePremiumAt !== null);
      },
      premiumNotHasExpired: function() {
        return (membershipInfo.lifeCycle !==lifeCycle.inactive && membershipInfo.lifeCycle !==lifeCycle.freeTrialExpired);
      },
      hasPrompt: function() {
        return (membershipInfo.upgradePrompt !== null);
      },
      isTrialing: function() {
        return (membershipInfo.lifeCycle ===lifeCycle.freeTrial);
      },
      validateMembership: function() {
        return (!this.premiumNotHasExpired() && !this.isTrialing());
      }
    };

    this.setMembershipInfo = function(userResponse, groupUserInfo, groupId) {

      membershipInfo.upgradePrompt = groupUserInfo.upgrade_prompt;
      membershipInfo.becamePremiumAt = userResponse.becamePremiumAt;
      membershipInfo.expiredAt = groupUserInfo.expires_at;
      membershipInfo.trialing = groupUserInfo.trialing;
      membershipInfo.lifeCycle = groupUserInfo.lifecycle;

    }

    this.showBuyButton = function() {
      return (!_membershipFn.premiumNotHasExpired() || _membershipFn.isTrialing());
    }

    this.canPractice = function() {
      return (_membershipFn.premiumNotHasExpired());
    }

    this.membershipValidation = function(groupId, nQuestions) {
      if (_membershipFn.validateMembership()) {
        var message = _membershipFn.hasPrompt() ? membershipInfo.upgradePrompt : appMessages.freeTrialExpired;
        grockitModal.showTrialExpiration(message, groupId, nQuestions);
      }

    }

    this.userCanAccesPage = function(groupId) {
      var sections = $location.path().split('/'),
      url = sections[sections.length - 1],
      baseUrl = utilities.originalGrockit().url;
      if (_membershipFn.validateMembership() && url!=='dashboard') {
          utilities.redirect(baseUrl+'/'+groupId+'/subscriptions/new');
      }
    }

    this.upgradePromptMessage = function(){
       return _membershipFn.hasPrompt() ? membershipInfo.upgradePrompt : appMessages.freeTrialExpired;
    }
  }

})();
