angular.module("grockitApp.authServices", ['ngCookies','webStorageModule'])
    .constant('UserRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('Auth', function($cookies,UserRoles,webStorage,Users,Groups,$location,$q,Headers) {

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
                var sessionParam = $location.search()._app_server_session;
                try {
                    if (sessionParam !== '' && angular.isDefined(sessionParam)) {
                        var sessionId = sessionParam;//+'=';
                        Headers.setDefaultHeader(sessionId);
                        $cookies.authorization_token = sessionId;
                        Users.one('self').get().then(function (result) {

                            currentUser = {
                                userId: result.user.id,
                                role: result.user.guest == true ? UserRoles.member : UserRoles.guest,
                                groupMemberships: result.user.group_memberships,
                                studyingFor: result.user.studying_for,
                                fullName: result.user.first_name,
                                avatar_url: result.user.avatar_url
                            };

                            Groups.setActiveGroup(result.user.studying_for);
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
                    webStorage.get('currentUser').groupMemberships = result.user.group_memberships;
                    webStorage.get('currentUser').studyingFor = result.user.studying_for;

                    Groups.setActiveGroup(result.user.studying_for);
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

