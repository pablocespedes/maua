/**
 * Created by Jose on 5/29/2014.
 */
request.factory('Users', function(Restangular) {
    return{
        UserInfo: Restangular.service('users')
    }

});


request.factory('Practice', function(Restangular) {

    return Restangular.service('practice')

});


