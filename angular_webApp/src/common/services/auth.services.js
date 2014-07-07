angular.module("grockitApp.authServices", ['ngCookies','webStorageModule'])
    .constant('UserRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('Auth', function($cookies,UserRoles,webStorage,Users,Utilities,$location,$q,Headers) {

        return {
            isLoggedIn: function () {
                if((webStorage.get('currentUser') == null || "") || ( angular.isUndefined($cookies.authorization_token) || $cookies.authorization_token == ''))
                    return false;
                else
                    return true;

            },
            logout: function () {
                try {
                    webStorage.remove('currentUser');
                    $cookies.authorization_token='';


                } catch (e) {
                }
            },
            setCurrentUser: function () {
               var  oldSite= ($location.host=='127.0.0.1' || 'grockit.firstfactoryinc.com') ? Utilities.originalGrockit().url+'/login?redirect=' : '' + '/login?redirect=',
                    newSite= Utilities.newGrockit().url,
                    params =$location.url().match(/.*[?&]_token=([^&]+)(&|$)/),
                    token = (params ? params[1] : ""),
                    deferred = $q.defer();

                try {
                    if (token !== '' && angular.isDefined(token)) {

                        var sessionId = token+'=';
                        Headers.setDefaultHeader(sessionId);
                        $cookies.authorization_token = sessionId;

                        Users.one('self').get().then(function (result) {

                            var response =result.data,
                            currentUser = {
                                userId: response.user.id,
                                role: response.user.guest == true ? UserRoles.member : UserRoles.guest,
                                groupMemberships: response.user.group_memberships,
                                studyingFor: response.user.studying_for,
                                groupName: '',
                                fullName: response.user.first_name,
                                avatar_url: response.user.avatar_url
                            };

                            Utilities.setActiveGroup(response.user.studying_for);

                            webStorage.add('currentUser', currentUser);

                            deferred.resolve(currentUser);

                        }).catch(function error(e) {
                            deferred.reject(e);
                        });

                    }
                    else {

                       if ($location.path() == '' || $location.path() == '/') {
                           newSite = newSite + '#/?' + '_token';
                       }
                       else {
                           newSite = newSite + '/?' + '_token';
                       }

                       Utilities.encodeRedirect(oldSite, newSite);

                    }
                    return deferred.promise;


                } catch (e) {
                    deferred.reject(e);
                }

            },
            getCurrentUserInfo: function () {
                return webStorage.get('currentUser');
            },
            getUpdateUserData: function () {
                var deferred = $q.defer();

                Users.one('self').get().then(function (result) {
                    var response = result.data,

                    currentUser = {
                        userId: response.user.id,
                        role: response.user.guest == true ? UserRoles.member : UserRoles.guest,
                        groupMemberships: response.user.group_memberships,
                        studyingFor: response.user.studying_for,
                        groupName: '',
                        fullName: response.user.first_name,
                        avatar_url: response.user.avatar_url
                    };

                    webStorage.add('currentUser', currentUser);
                    Utilities.setActiveGroup(response.user.studying_for);

                    deferred.resolve(webStorage.get('currentUser'));

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

