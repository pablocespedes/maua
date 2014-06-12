home.factory('Account', function ($cookieStore,$cookies) {
    return {
        isUserAuthenticated: function () {
            var t = $cookieStore;
            var user_id = $cookies.user_id;
            if((user_id==='') ||angular.isUndefined(user_id)){
                $cookies.user_id ='f58077f0-3084-012d-4d3f-123139068df2';//('user_id','f58077f0-3084-012d-4d3f-123139068df2');
                user_id = $cookies.user_id;
            }
            return user_id;
        }
    };
});