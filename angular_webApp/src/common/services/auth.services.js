angular.module("grockitApp.authServices", ['ngCookies','webStorageModule'])
    .constant('UserRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('Auth', function($cookies,UserRoles,webStorage,Users,Groups,$location,$q){

    return {
        authorize: function(next) {

            if(angular.isDefined(next.access)){
                var authorizedRoles = next.access.authorizedRoles;

                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (this.isLoggedIn() &&
                    authorizedRoles.indexOf(this.isLoggedIn().role) !== -1);
            }

        },
        isLoggedIn: function() {
            if((webStorage.get('currentUser') == null || "") || ( angular.isUndefined($cookies._app_server_session) || $cookies._app_server_session=='')) {
                return false;
            }
            else {
                return true;
            }

        },
        logout: function() {


            try{
                //var userData = webStorage.get('_app_server_session');
                //Headers.removeDefaultHeader(sessionId);
                webStorage.remove('currentUser');
                $cookies.remove('_app_server_session');


            }catch(e){
            }

        },
        setCurrentUser: function () {
            var deferred = $q.defer(), currentUser=undefined;
            var sessionParam = $location.search()._app_server_session;
            try {
                if (sessionParam !== '' && angular.isDefined(sessionParam)) {
                    //Headers.setDefaultHeader(SessionObject);

                    Users.one("f58077f0-3084-012d-4d3f-123139068df2").get().then(function (result) {

                        currentUser = {
                            userId: result.user.id,
                            role: result.user.guest == true ? UserRoles.member : UserRoles.guest,
                            groupMemberships: result.user.group_memberships,
                            studyingFor: result.user.studying_for,
                            fullName: result.user.first_name
                        };

                        Groups.setActiveGroup(result.user.studying_for);
                        webStorage.add('currentUser', currentUser);
                        $cookies._app_server_session= sessionParam;
                        deferred.resolve(currentUser);

                    }).catch(function error(e) {
                        deferred.reject(e);
                    });

                }
                else{
                    deferred.resolve(currentUser);
                }
                return deferred.promise;
            }catch(e){
                deferred.reject(e);
            }

        },
        getCurrentUserInfo: function() {
            return webStorage.get('currentUser');
        },
        updateUserInfo: function(currentUser){
            webStorage.add('currentUser', currentUser);
        }
    };
});

