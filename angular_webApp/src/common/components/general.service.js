/**
 * Created by Jose on 5/8/14.
 */
app.service('getApiUrlRequest', function($http, $q) {
    this.get = function(){
        var deferred = $q.defer();
        var url = 'common/json/url.json';
        $http.get(url).success(function(data, status) {
            deferred.resolve(data);
        }).error(function(data, status) {
                deferred.reject(data);
            });

        return deferred.promise;
    };
});


app.service('tempRequest', function($http, $q) {
    this.get = function(pos){
        var deferred = $q.defer();
        var url = 'http://grockit.firstfactoryinc.com/common/json/testDAta.json';
        $http.get(url).success(function(data, status) {
            deferred.resolve(data);
        }).error(function(data, status) {
                deferred.reject(data);
            });

        return deferred.promise;
    };
});



app.service('ApiRequest', function($resource, $q) {
    this.doRequest = function(config, url){
        var deferred = $q.defer();
        switch(config.method){
            case 'POST': $http.defaults.headers.post['Content-Type'] = config.contentType; break;
            case 'PUT': $http.defaults.headers.put['Content-Type'] = config.contentType; break;
            case 'GET': case 'DELETE': url +=  config.data; break;
        }

        var res = $resource(url, {},{
            postPut: {
                method : config.method,
                params: { 'gRockit': new Date().getTime() },
                data: {info:'@info'}
            },
            getDelete: {
                method : config.method,
                params: { 'gRockit': new Date().getTime() }
            }
        });

        switch(config.method){
            case 'GET': case 'DELETE': {
            res.getDelete.success(function(response){
                deferred.resolve(response);
            }).error(function(data, status) {
                    deferred.reject(data);
                });
            break;
        }
            case 'POST': case 'PUT': {
            res.postPut(JSON.stringify(config.data), function(response){
                deferred.resolve(data);
            }).error(function(data, status) {
                    deferred.reject(data);
                });
            break;
        }
        }

        return deferred.promise;
    };
});
