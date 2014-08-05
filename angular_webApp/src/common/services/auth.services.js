angular.module("grockitApp.authServices", ['webStorageModule'])
.constant('UserRoles', {
  admin: 'admin',
  member: 'member',
  guest: 'guest'
})
.factory('Auth', function($cookies, UserRoles, webStorage, Users, Utilities, $location, $q,Headers) {
  var updateSelectedGroup = function(defaultGroup) {
    return angular.isDefined(Utilities.getCurrentParam('subject')) ? Utilities.getCurrentParam('subject') :defaultGroup;
  };

  var setUserData = function(response) {
    var user = webStorage.get('currentUser'), localUserExists = user !=null,
    trackData=  localUserExists && angular.isDefined(user.trackData) ? user.trackData : '',
    defaultGroup = localUserExists && angular.isDefined(user.currentGroup) ? user.currentGroup :
    response.group_memberships[0].group_id,
    currentUser = {
      userId: response.id,
      role: response.guest ? UserRoles.guest : UserRoles.member,
      groupMemberships: response.group_memberships,
      currentGroup: defaultGroup,
      fullName: response.first_name,
      avatar_url: response.avatar_url,
      emailAddress: response.email_address,
      trackData: trackData
    };

    Utilities.setActiveGroup(currentUser.currentGroup);
    webStorage.add('currentUser', currentUser);
    return currentUser;
  };

  return {
    isLoggedIn: function () {
      return ( !!$cookies["authentication_token"] );
    },
    logout: function() {
      webStorage.remove('currentUser');
      $location.url("/logout");
    },
    getCurrentUserInfo: function() {
      return webStorage.get('currentUser');
    },
    getUpdateUserData: function () {
      var deferred = $q.defer();

      Headers.updateDefaultHeader();
      Users.getUser().self().then(function (result) {
        var userData = setUserData(result.data.user);
        deferred.resolve(userData);
      }).catch(function error(e) {
        deferred.resolve(webStorage.get('currentUser'));
      });

      return deferred.promise;
    },
    updateUserInfo: function (currentUser) {
      webStorage.add('currentUser', currentUser);
    }
  };
});

