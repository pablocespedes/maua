angular.module("grockitApp.authServices", ['webStorageModule'])
    .constant('UserRoles', {
        admin: 'admin',
        member: 'member',
        guest: 'guest'
    })
    .factory('Auth', function($cookies,UserRoles,webStorage,Users,Utilities,$location,$q,Headers) {

        var updateSelectedGroup= function(defaultGroup){
            /*Utilities.getCurrentParam('subject') will inspect the url searching for the subject parameter*/
           return angular.isDefined(Utilities.getCurrentParam('subject')) ? Utilities.getCurrentParam('subject') :defaultGroup;

        };

        var setUserData = function(response,isUpdate) {

            var defaultGroup = response.group_memberships[0].group_id,
                trackData=  webStorage.get('currentUser') !=null &&
                            angular.isDefined(webStorage.get('currentUser').trackData) ? webStorage.get('currentUser').trackData : '',
                currentUser = {
                    userId: response.id,
                    role: response.guest == true ? UserRoles.member : UserRoles.guest,
                    groupMemberships: response.group_memberships,
                    currentGroup: isUpdate ? updateSelectedGroup(defaultGroup) : defaultGroup,
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
                return !((webStorage.get('currentUser') == null || "") || ( angular.isUndefined($cookies.authorization_token) || $cookies.authorization_token == ''))

            },
            logout: function () {
                try {
                    webStorage.remove('currentUser');
                    $cookies.authorization_token='';


                } catch (e) {
                }
            },
            setCurrentUser: function () {

                var params =$location.url().match(/.*[?&]_token=([^&]+)(&|$)/),
                    token = (params ? params[1] : ""),userData=undefined,
                    deferred = $q.defer();

                try {
                    if (token !== '' && angular.isDefined(token)) {

                        var sessionId = token + '=';
                        Headers.setDefaultHeader(sessionId);
                        $cookies.authorization_token = sessionId;

                        Users.getUser().self().then(function (result) {

                            userData = setUserData(result.data.user,false);

                            deferred.resolve(userData);

                        }).catch(function error(e) {
                            deferred.reject(e);
                        });

                    }
                    else {
                        deferred.resolve(userData);

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

                Users.getUser().self().then(function (result) {
                    var userData = setUserData(result.data.user,true);

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

