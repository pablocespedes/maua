/**
 * Created by xoanrm20 on 6/6/14.
 */

/*
* create a service, which provides your elasticsearch client
* to other parts of your application
*/
elasticSearchConnector.service('elasticSearch', function (esFactory) {
    return esFactory({ host: 'localhost:9200' });
});


