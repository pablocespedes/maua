angular.module("grockitApp.authServices", ['ngCookies','webStorageModule'])
    .constant('UserRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('Auth', function($cookies,UserRoles,webStorage,Users,Utilities,$location,$q,Headers) {

        var setUserData = function(response) {

            var currentGroup = response.group_memberships[0].group_id, //!!response.studying_for ? response.studying_for :
                currentUser = {
                    userId: response.id,
                    role: response.guest == true ? UserRoles.member : UserRoles.guest,
                    groupMemberships:response.group_memberships,
                    currentGroup: currentGroup,
                    fullName: response.first_name,
                    avatar_url: response.avatar_url
                };

            Utilities.setActiveGroup(currentGroup);

            webStorage.add('currentUser', currentUser);

            return currentUser;
        };

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

                        var sessionId = token + '=';
                        Headers.setDefaultHeader(sessionId);
                        $cookies.authorization_token = sessionId;

                        Users.one('self').get().then(function (result) {

                            var userData = setUserData(result.data.user);

                            deferred.resolve(userData);

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

