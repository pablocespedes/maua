/**
 * Created by Jose on 5/29/2014.
 */
request.factory('Users', function(Restangular) {
    return  Restangular.service('users')

});

request.factory('ApiV3Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://staging.grockit.com/api/v3/');
    });
});

request.factory('Questions', function(ApiV3Restangular) {

    return ApiV3Restangular.service('questions');

});



