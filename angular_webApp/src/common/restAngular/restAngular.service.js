
request.factory('Users', function(Restangular) {
    return  Restangular.service('users')

});

request.factory('Questions', function(Restangular) {
    return  Restangular.service('questions')

});

request.factory('Groups', function(Restangular) {
    return  Restangular.service('group')

});

request.factory('ApiV3Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://staging.grockit.com/api/v3/');
        RestangularConfigurer.setRequestSuffix('.json');
    });
});

request.factory('Questions', function(ApiV3Restangular) {

    return ApiV3Restangular.service('questions');

});


