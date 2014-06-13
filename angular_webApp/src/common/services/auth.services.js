angular.module('grockitApp.authServices', ['webStorageModule'])
    .constant('userRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('authService', function (Session, $location) {
        return {
            verifySessionURL: function () {
                var SessionObject = $location.search()._app_server_session;
                if (SessionObject !== '' && angular.isDefined(SessionObject)) {
                    Session.create(SessionObject);
                    return true;
                } else {
                    return false;
                }
            },
            isAuthenticated: function () {
                return Session.isSessionDefined();
            },
            isAuthorized: function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (this.isAuthenticated() &&
                    authorizedRoles.indexOf(Session.userRole) !== -1);
            }
        };
    })
    .factory('Session', function (webStorage, Users, Headers,userRoles) {
        return {
            create: function (sessionId) {
                Headers.setDefaultHeader(sessionId);

                Users.one("f58077f0-3084-012d-4d3f-123139068df2").get().then(function (result) {
                    var userData=result.user,
                     _app_server_session = {
                        id: sessionId,
                        userId: userData.id,
                        userRole: userData.guest == true ? userRoles.member : userRoles.guest,
                        group_memberships: userData.group_memberships,
                        studying_for: userData.studying_for
                    };


                    webStorage.add('_app_server_session', _app_server_session);

                }).catch(function error(msg) {
                    console.error(msg.headers());
                });

            },
            destroy: function () {
                var sessionid = webStorage.get('_app_server_session').id;
                Headers.removeDefaultHeader(sessionid);
                webStorage.remove('_app_server_session');
            },
            isSessionDefined: function () {
                return webStorage.get('_app_server_session') == null || "" ? false : true;

            }
        }
    });