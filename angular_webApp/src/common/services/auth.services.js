angular.module("grockitApp.authServices", ['ngCookies','webStorageModule'])
    .constant('UserRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('Auth', function($cookies,UserRoles,webStorage,Users,Utilities,$location,$q,Headers) {

        return {
            authorize: function (next) {

                if (angular.isDefined(next.access)) {
                    var authorizedRoles = next.access.authorizedRoles;

                    if (!angular.isArray(authorizedRoles)) {
                        authorizedRoles = [authorizedRoles];
                    }
                    return (this.isLoggedIn() &&
                        authorizedRoles.indexOf(this.isLoggedIn().role) !== -1);
                }

            },
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
                var deferred = $q.defer(), currentUser = undefined;
                var sessionParam = $location.search()._token;
                try {
                    if (sessionParam !== '' && angular.isDefined(sessionParam)) {
                        var sessionId = sessionParam+'=';
                        Headers.setDefaultHeader(sessionId);
                        $cookies.authorization_token = sessionId;
                        Users.one('self').get().then(function (result) {
                            var response =result.data;
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
                        deferred.resolve(currentUser);
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
                    var response = result.data;

                    webStorage.get('currentUser').groupMemberships = response.user.group_memberships;
                    webStorage.get('currentUser').studyingFor = response.user.studying_for;
                    webStorage.get('currentUser').role = response.user.guest == true ? UserRoles.member : UserRoles.guest;

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

